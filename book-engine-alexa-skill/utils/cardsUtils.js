/**
 * @file functions for generating cards for alexa app
 */

'use strict'

const coreUtils = require('./coreUtils')
const speechUtils = require('./speechUtils')

const cardsUtils = {}

cardsUtils.generateCardTitle = function (params) {
    const {
        skillName, decision, book, author
    } = params
    let text = skillName
    const titleAndAuthor = coreUtils.appendBookTitleAndAuthor(book, author)
    if (typeof decision !== 'undefined') text += ` - ${decision}`
    else text += ` - ${titleAndAuthor}`
    return text
  };
  
  cardsUtils.generateCardText = function (params) {
    const {
        intentName, book, author, lastReq, description, session, similar_books, url
    } = params
    let text = speechUtils.generateSpeechText({
      book, author, lastReq, description, session, similar_books
    }).speechOutput
    if (intentName === 'GetBookInfo') {
      text += ` GoodReads URL: ${url}`
    }
    return text
  };
  
  cardsUtils.generateCard = function (params) {
    const {
      lastReq, cardTitle, cardText, small_image_url, image_url, book, author, decision, skillName, intentName, url, description, session, similar_books
    } = params
    const card = {
      type: 'Standard',
      title: cardTitle || this.generateCardTitle({ book, author, skillName, decision }),
      text: cardText || this.generateCardText({ url, lastReq, intentName, book, author, lastReq, description, session, similar_books }),
      content: cardText || this.generateCardText({ url, lastReq, intentName, book, author, lastReq, description, session, similar_books })
    }
    if (intentName === 'GetBookInfo') {
      card.image = {};
      card.type = 'Standard';
      card.image.smallImageUrl = small_image_url;
      card.image.largeImageUrl = image_url;
    }
    return card;
  };

  module.exports = cardsUtils
