/**
 * @file functions for generating speech response for alexa skill
 */

'use strict'

const speechUtils = {};

/* OutputSpeech related methods */
speechUtils.generateOutputSpeech = function (params) {
    const {
      book, author, lastReq, description, session, similar_books, output
    } = params;
    const outputSpeech = {
      type: 'PlainText',
      text: output || this.generateSpeechText(params).speechOutput
    }
    return outputSpeech
  }
  
speechUtils.generateSpeechText = function (params) {
    const { book, author, lastReq, description, session, similar_books } = params
    const resp = {}
    switch (lastReq) {
      case 'basic':
        resp.speechOutput = `${description} Do you want to get list of similar books like ${book}?`
        break
      case 'Description':
        resp.speechOutput = `${this.getSimiliarBooks({ book, similar_books })}`
        break
      case 'similar Books':
        resp.speechOutput = 'similar_books'
        break
      case 'More books from Author':
        resp.speechOutput = 'similar_books'
        break
      default:
        resp.speechOutput = `${session.book.title} from ${session.author.name} was published in ${session.book.publication_year} by publisher ${session.book.publisher}. `
                  + `It consists of ${session.book.num_pages} pages. `
                  + `Its average rating on Goodreads is ${session.book.average_rating} from ${session.book.ratings_count} ratings. `
                  + `Do you want to listen to a brief description of ${session.book.title}? `
        break
    }
    return resp
}

speechUtils.getSimiliarBooks = function (params) {
    const { book, similar_books } = params
    if (!similar_books.length) return `We do not have any books similar to ${book}`;
        let text = 'List of similar books: ';
        for (let index = 0; index < similar_books.length; index++) {
        const bookItem = similar_books[index];
        text += `${bookItem.title}, `;
    }
    text += ' Thank you for using Kids Classic Books.';
    return text;
}

module.exports = speechUtils
