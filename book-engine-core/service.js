/**
 * @author Mukul <@mukul1904>
 * @description Common services like APIs and mongo operations for Book Engine apps
 */

 'use strict';

const goodReadsJSONResponse = require('goodreads-json-api');
const https = require('https');
const mongoose = require('mongoose')
const scrapBooksModel = mongoose.model('scraped-books', {}, 'scraped-books');

const GOODREADS_KEY = process.env.GOODREADS_KEY;
const alexaLogger = require('./logger');

const genres = [
  "Art",
  "Biography",
  "Business",
  "Chick Lit",
  "Christian",
  "Classics",
  "Comics",
  "Contemporary",
  "Cookbooks",
  "Crime",
  "Ebooks",
  "Fantasy",
  "Fiction",
  "Gay and Lesbian",
  "Graphic Novels",
  "Historical Fiction",
  "History",
  "Horror",
  "Manga",
  "Memoir",
  "Music",
  "Mystery",
  "Nonfiction",
  "Paranormal",
  "Philosophy",
  "Poetry",
  "Psychology",
  "Religion",
  "Romance",
  "Science",
  "Science Fiction",
  "Suspense",
  "Spirituality",
  "Sports",
  "Thriller",
  "Travel",
  "Young Adult"
];

const generateBookInfoEndPoint = (params) => {
    const {
      authorName, bookTitle
    } = params;
    const resp = {};
    resp.API = 'https://www.goodreads.com/book/title.xml';
    if (authorName) {
      resp.API += `?author${authorName}&key=${GOODREADS_KEY}&title=${bookTitle}`;
    } else {
      resp.API += `?key=${GOODREADS_KEY}&title=${bookTitle}`;
    }
    return resp;
};

const handleBookInfoReq = (params) => {
    return new Promise((resolve, reject) => {
        const {
          authorName, bookTitle
        } = params;
        alexaLogger.logInfo(`Author: ${authorName}, Book: ${bookTitle} Requested`);
        const {
            API
        } = generateBookInfoEndPoint({ authorName, bookTitle });
        alexaLogger.logInfo(`Endpoint generated: ${API}`);
        https.get(API, (res) => {
          const options = {
            xml: {
              normalizeWhitespace: true
            }
          };
          const statusCode = res.statusCode;
          const contentType = res.headers['content-type'];
          let error;
          if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
          }
          /**
           * In case statusCode is not 200
           */
          if (error) {
            alexaLogger.logError(error.message);
            // consume response data to free up memory
            res.resume();
          }
      
          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', chunk => rawData += chunk);
          res.on('end', () => {
            try {
              /**
               * JSON response converted from Goodreads XML response
               * popular_shelves, book, author, similar_books
               */
              const resp = goodReadsJSONResponse.convertToJson(rawData);
              return resolve(resp);
            } catch (e) {
              alexaLogger.logError(e.message);
              reject(e)
            }
          });
        }).on('error', (e) => {
          alexaLogger.logError(`Got error: ${e.message}`);
          reject(e)
        });
    });
  };

  const scrapeService = (params) => {
    return new Promise((resolve, reject) => {
      const {
        type, bookGenre
      } = params;
      if (genres.indexOf(bookGenre) === -1) {
        return resolve({
          response: `${bookGenre} is not supported yet.`
        });
      }
      mongoose.connect(process.env.MONGO_URL)
        .then(() => {
          const query = {
            genre: bookGenre
          };
          return scrapBooksModel.findOne(query)
        })
        .then((scrapedData) => {
          scrapedData = scrapedData.toJSON();
          let OperationType;
          if (type === 'most read this week') {
            OperationType = 'most_read_this_week'
          } else if (type === 'most popular') {
            OperationType = 'most_popular'
          }
          mongoose.disconnect();
          return resolve({
            response: `${type} ${bookGenre} books are: ${scrapedData[OperationType].slice(0, 9).map(book => book.title).toString()}`
          });
        })
        .catch((err) => {
          mongoose.disconnect();
          return reject(err);
        })
    });
  }

  module.exports = {
    handleBookInfoReq,
    scrapeService
  }