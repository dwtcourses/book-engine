import { reject } from '../../../../Library/Caches/typescript/2.6/node_modules/@types/async';

'use strict';

const goodReadsJSONResponse = require('goodreads-json-api');
const https = require('https');
const mongoose = require('mongoose')

const GOODREADS_KEY = process.env.GOODREADS_KEY;
const alexaLogger = require('./logger');

const generateEndPointAndCardTitle = (params) => {
    const {
        book, author
    } = params
    const resp = {};
    resp.API = 'https://www.goodreads.com/book/title.xml';
    if (author) {
      resp.API += `?author${author}&key=${GOODREADS_KEY}&title=${book}`;
    } else {
      resp.API += `?key=${GOODREADS_KEY}&title=${book}`;
    }
    return resp;
};

const handleReq = (intentRequest) => {
    return new Promise((resolve, reject) => {
        const author = intentRequest.currentIntent.slots.AuthorName;
        const book = intentRequest.currentIntent.slots.BookName;
        const source = intentRequest.invocationSource;
        alexaLogger.logInfo(`Author: ${author}, Book: ${book}`);
        const {
            API
        } = generateEndPointAndCardTitle({ book, author });
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
              /* JSON response converted from Goodreads XML response */
              const resp = goodReadsJSONResponse.convertToJson(rawData);
              const {
                  popular_shelves, book, author, similar_books
              } = resp;
              return resolve({
                  bookTitle: book.title,
                  bookDesc: book.description,
                  publication_year: book.publication_year,
                  publisher: book.publisher,
                  average_rating: book.average_rating,
                  ratings_count: book.ratings_count,
                  num_pages: book.num_pages,
                  author: author.name,
                  popular_shelves: popular_shelves,
                  similar_books: similar_books
              });
        
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

  const scrapeService = (intentRequest) => {
    return new Promise((resolve, reject) => {
      const genre = ntentRequest.currentIntent.slots.BookGenre;
      const type = ntentRequest.currentIntent.slots.OperationType;
      mongoose.connect(process.env.MONGO_URL)
        .then(() => {
          const scrapBooksModel = mongoose.model('scraped-books', {}, 'scraped-books');
          const query = {
            genre
          };
          return scrapBooksModel.findOne(query)
        })
        then((scrapedData) => {
          scrapedData = scrapedData.toJSON();
          let OperationType;
          if (type === 'most read this week') {
            OperationType = 'most_read_this_week'
          } else if (type === 'most popular') {
            OperationType = 'most_popular'
          }
          return resolve({
            response: `${type} ${bookGenre} books are: ${scrapedData[OperationType].slice(0, 9).map(book => book.title).toString()}`
          });
        })
        .catch((err) => reject(err))
    });
  }

  module.exports = {
    handleReq
  }