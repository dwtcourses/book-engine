/**
 * @file kidsService.js
 * @author Mukul <@mukul1904>
 * @desc Service for kids-classic-books Alexa skill
 */


/* eslint-disable strict, no-return-assign, consistent-return, no-unused-vars */

'use strict';

const goodReadsJSONResponse = require('goodreads-json-api')
const https = require('https')

const messages = require('./messages')
const alexaLogger = require('./logger')
const utils = require('./utils')
const ScrapedBooksModel = require('./model')

const skillName = 'BFI Book Engine';

/**
 * @constructor
 */
function KidsService(params) {
  const {
        book, author, bookGenre, intent, session, requestId, reqType, appId, sessionId, intentName
    } = params;
  this.name = 'BFI Book Engine';
  this.book = book;
  this.author = author;
  this.bookGenre = bookGenre;
  this.intent = intent || {};
  this.session = session || {};
  this.requestId = requestId;
  this.reqType = reqType;
  this.appId = appId;
  this.sessionId = sessionId;
  this.intentName = intentName || '';
}

KidsService.prototype.logRequest = function () {
  alexaLogger.logInfo(`ApplicationId=${this.appId}. RequestID=${this.reqType}. ReqType=${this.reqType}. Intent=${this.intentName}. SessionsId=${this.sessionId}`);
};

KidsService.prototype.handleIntent = function () {
  return new Promise((resolve) => {
    switch (this.reqType) {
      case 'LaunchRequest':
        this.handleLaunchRequest((resp) => {
          const {
            sessionAttributes, speechletResponse
          } = resp;
          return resolve({ sessionAttributes, speechletResponse });
        });
        break;
      case 'IntentRequest':
        this.handleIntentRequest((resp) => {
          const {
            sessionAttributes, speechletResponse
          } = resp;
          return resolve({ sessionAttributes, speechletResponse });
        });
        break;
      case 'SessionEndedRequest':
        this.handleExitRequest((resp) => {
          const {
            sessionAttributes, speechletResponse
          } = resp;
          return resolve({ sessionAttributes, speechletResponse });
        });
        break;
      default:
        break;
    }
  });
};

/**
 * @desc Greeting handler
 */
KidsService.prototype.handleLaunchRequest = function (done) {
  // If we wanted to initialize the session to have some attributes we could add those here.
  const sessionAttributes = {};
  // If the user either does not reply to the welcome message or says something that is not
  // understood, they will be prompted again with this text.
  const repromptText = messages.repromptGreeting();
  const shouldEndSession = false;
  const outputSpeech = utils.speech.generateOutputSpeech({
    output: messages.messageGreeting()
  });
  const card = utils.cards.generateCard({
    cardTitle: messages.cardGreeting(),
    cardText: messages.messageGreeting()
  });
  done({
    sessionAttributes,
    speechletResponse: { card, outputSpeech, repromptText, shouldEndSession }
  });
};

/**
 * @desc Exit and StopIntent handler
 */
KidsService.prototype.handleExitRequest = function (done) {
  const shouldEndSession = true;
  const card = utils.cards.generateCard({
    cardTitle: messages.cardGoodBye(),
    cardText: messages.messageGoodBye()
  });
  const outputSpeech = utils.speech.generateOutputSpeech({
    output: messages.messageGoodBye()
  });
  this.session = {};
  done({
    sessionAttributes: {},
    speechletResponse: { card, outputSpeech, repromptText: null, shouldEndSession }
  });
};

/**
 * @desc CancelIntent handler
 */
KidsService.prototype.handleCancelRequest = function (done) {
  const shouldEndSession = true;
  const card = utils.cards.generateCard({
    cardTitle: messages.cardGoodBye(),
    cardText: messages.messageGoodBye()
  });
  const outputSpeech = utils.speech.generateOutputSpeech({
    output: messages.messageGoodBye()
  });
  this.session = {};
  done({
    sessionAttributes: {},
    speechletResponse: { card, outputSpeech, repromptText: null, shouldEndSession }
  });
};

/**
 * @desc HelpIntent handler
 */
KidsService.prototype.handleHelpRequest = function (done) {
  const shouldEndSession = false;
  const repromptText = messages.messageReprompt();
  const card = utils.cards.generateCard({
    cardTitle: messages.cardHelp(),
    cardText: messages.messageHelp()
  });
  const outputSpeech = utils.speech.generateOutputSpeech({
    output: messages.messageHelp()
  });
  done(this.session,
        { card, outputSpeech, repromptText, shouldEndSession });
};

KidsService.prototype.handleIntentRequest = function (done) {
  switch (this.intentName) {
    case 'AMAZON.YesIntent':
      this.handleYesRequest((sessionAttributes, speechletResponse) => {
        done({ sessionAttributes, speechletResponse });
      });
      break;
    case 'AMAZON.NoIntent':
      this.handleNoRequest((sessionAttributes, speechletResponse) => {
        done({ sessionAttributes, speechletResponse });
      });
      break;
    case 'AMAZON.CancelIntent':
      this.handleCancelRequest((resp) => {
        done(resp);
      });
      break;
    case 'AMAZON.StopIntent':
      this.handleExitRequest((resp) => {
        done(resp);
      });
      break;
    case 'AMAZON.HelpIntent':
      this.handleHelpRequest((sessionAttributes, speechletResponse) => done({ sessionAttributes, speechletResponse }));
      break;
    case 'GetBookInfo':
      this.handleBookInfoRequest((sessionAttributes, speechletResponse) => done({ sessionAttributes, speechletResponse }));
      break;
    case 'GetAllTimePopularBooks':
      this.handleGetAllTimePopularBooksRequest((sessionAttributes, speechletResponse) => done({ sessionAttributes, speechletResponse }));
      break;
    case 'GetPopularWeeklyBooks':
      this.handleGetPopularWeeklyBooksRequest((sessionAttributes, speechletResponse) => done({ sessionAttributes, speechletResponse }));
      break;
    case 'WelcomeIntent':
      this.handleWelcomeIntent((sessionAttributes, speechletResponse) => done({ sessionAttributes, speechletResponse }));
      break;
    default:
      break;
  }
};

KidsService.prototype.handleWelcomeIntent = function (done) {
  const card = {
    type: 'Standard',
    title: 'Welcome to Build for India Book Engine',
    text: 'Welcome to Build for India Book Engine. Say \'help\' to get sample questions.',
    content: 'Welcome to Build for India Book Engine. Say \'help\' to get sample questions.'
  }

  const outputSpeech = {
    type: 'PlainText',
    text: 'Welcome to Build for India Book Engine. Say \'help\' to get sample questions.',
  }
  
  return done(this.session,
    { card, outputSpeech, repromptText: messages.repromptGreeting, shouldEndSession: false });
};

KidsService.prototype.handleGetAllTimePopularBooksRequest = function (done) {
  const bookGenre = this.bookGenre;
  ScrapedBooksModel.findOne({ genre: bookGenre })
    .then((scrapedData) => {
      scrapedData = scrapedData.toJSON();
      this.session = {};
      const card = utils.cards.generateCard({
        cardTitle: `Most Popular ${bookGenre} Books of All-time`,
        cardText: 'For more, refer goodreads site.'
      });
      const outputSpeech = utils.speech.generateOutputSpeech({
        output: `Alltime Most popular ${bookGenre} books are: ${scrapedData.most_popular.slice(0, 9).map(book => book.title).toString()}`
      });
      return done(this.session,
                { card, outputSpeech, repromptText: null, shouldEndSession: true });
    })
};

KidsService.prototype.handleGetPopularWeeklyBooksRequest = function (done) {
  const bookGenre = this.bookGenre;
  ScrapedBooksModel.findOne({ genre: bookGenre })
    .then((scrapedData) => {
      scrapedData = scrapedData.toJSON();
      this.session = {};
      const card = utils.cards.generateCard({
        cardTitle: `Most Read Weekly ${bookGenre} Books`,
        cardText: 'For more, refer goodreads site.'
      });
      const outputSpeech = utils.speech.generateOutputSpeech({
        output: `Most popular ${bookGenre} books for this week are: ${scrapedData.most_read_this_week.slice(0, 9).map(book => book.title).toString()}`
      });
      return done(this.session,
                { card, outputSpeech, repromptText: null, shouldEndSession: true });
    })
};

KidsService.prototype.shouldEndSession = function () {
  const { session } = this;
  let flag = true;
  switch (session.lastReq) {
    case 'basic':
      flag = false;
      break;
    case 'Description':
      flag = true;
      break;
    case 'similar Books':
      flag = true;
      break;
    case 'More books from Author':
      flag = true;
      break;
    default:
      flag = false;
      break;
  }
  return flag;
};

KidsService.prototype.setLastReq = function () {
  const { session } = this;
  const { bookName, authorName } = session;
  switch (session.lastReq) {
    case 'basic':
      session.lastReq = 'Description';
      session.decision = `similar Books like ${bookName}`;
      break;
    case 'Description':
      session.lastReq = 'similar Books';
      session.decision = `More books from Author ${authorName}`;
      break;
    case 'similar Books':
      session.lastReq = 'More books from Author';
      session.decision = '';
      break;
    case 'More books from Author':
      session.lastReq = 'Last';
      session.decision = '';
      break;
    default:
      session.lastReq = 'basic';
      session.decision = `Description of ${utils.core.appendBookTitleAndAuthor({ book: bookName, author: authorName })}`;
      break;
  }
};

KidsService.prototype.handleYesRequest = function (done) {
  const shouldEndSession = this.shouldEndSession();
  const repromptText = messages.messageReprompt();
  const {
    book, author, similar_books
  } = this.session;
  const card = utils.cards.generateCard({
    url: book.url,
    small_image_url: book.small_image_url,
    image_url: book.image_url,
    book: book.title,
    author: author.name,
    decision: this.session.lastReq,
    lastReq: this.session.lastReq,
    description: book.description,
    skillName,
    intentName: 'GetBookInfo',
    session: this.session,
    similar_books: similar_books
  });
  const outputSpeech = utils.speech.generateOutputSpeech({
    url: book.url,
    small_image_url: book.small_image_url,
    image_url: book.image_url,
    book: book.title,
    author: author.name,
    decision: this.session.lastReq,
    lastReq: this.session.lastReq,
    description: book.description,
    skillName,
    intentName: 'GetBookInfo',
    session: this.session,
    similar_books: similar_books
  });
  this.setLastReq();
  this.session = this.session;
  return done(this.session,
            { card, outputSpeech, repromptText: null, shouldEndSession });
};

KidsService.prototype.handleNoRequest = function (done) {
  const shouldEndSession = true;
  const repromptText = null;
  const card = utils.cards.generateCard({
    cardTitle: messages.cardGoodBye(),
    cardText: messages.messageGoodBye()
  });
  const outputSpeech = utils.speech.generateOutputSpeech({
    output: messages.messageGoodBye()
  });
  this.session = {};
  done(this.session,
    { card, outputSpeech, repromptText, shouldEndSession }
  );
};

KidsService.prototype.handleBookInfoRequest = function (done) {
  const bookVal = this.intent.slots.BookName.value;
  const authorVal = this.intent.slots.AuthorName.value;
  alexaLogger.logInfo(`Author: ${authorVal}, Book: ${bookVal}`);
  const repromptText = messages.messageReprompt();
  const shouldEndSession = false;

  /**
   * In case user doesn't mention either book title or author
   */
  if (utils.core.validateRequest(authorVal, bookVal)) {
    const card = utils.cards.generateCard({
      cardTitle: messages.cardInvalidRequest(),
      cardText: messages.messageInvalidRequest()
    });
    const outputSpeech = utils.speech.generateOutputSpeech({
      output: messages.messageInvalidRequest()
    });
    return done(this.session,
            { card, outputSpeech, repromptText, shouldEndSession });
  }
  const {
      API
  } = utils.core.generateEndPointAndCardTitle({ book: bookVal, author: authorVal });
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
      const card = utils.cards.generateCard({
        cardTitle: messages.cardInvalidRequest(),
        cardText: messages.messageInvalidRequest()
      });
      const outputSpeech = utils.speech.generateOutputSpeech({
        output: messages.messageInvalidRequest()
      });
      return done(this.session,
          { card, outputSpeech, repromptText: null, shouldEndSession: true });
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', chunk => rawData += chunk);
    res.on('end', () => {
      try {
        /* JSON response converted from Goodreads XML response */
        const resp = goodReadsJSONResponse.convertToJson(rawData);
        const {
            popular_shelves, book, author
        } = resp;
        resp.bookName = book.title;
        resp.authorName = author.name;
        delete resp.popular_shelves; /* No need for this in future requests, so deleting it to reduce the json size */
        this.setSession(resp);
        const card = utils.cards.generateCard({
          url: book.url,
          small_image_url: book.small_image_url,
          image_url: book.image_url,
          book: book.title,
          author: author.name,
          decision: this.session.lastReq,
          lastReq: this.session.lastReq,
          description: book.description,
          skillName,
          intentName: 'GetBookInfo',
          session: this.session,
          similar_books: book.similar_books
        });
        const outputSpeech = utils.speech.generateOutputSpeech({
          url: book.url,
          small_image_url: book.small_image_url,
          image_url: book.image_url,
          book: book.title,
          author: author.name,
          decision: this.session.lastReq,
          lastReq: this.session.lastReq,
          description: book.description,
          skillName,
          intentName: 'GetBookInfo',
          session: this.session,
          similar_books: book.similar_books
        });
        this.setLastReq();
        return done(this.session,
            { card, outputSpeech, repromptText: null, shouldEndSession: false });
      } catch (e) {
        alexaLogger.logError(e.message);
      }
    });
  }).on('error', (e) => {
    alexaLogger.logError(`Got error: ${e.message}`);
  });
};

KidsService.prototype.setSession = function (session) {
  this.session = session;
};

KidsService.prototype.getSession = function () {
  return this.session;
};

module.exports = KidsService;
