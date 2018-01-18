/**
 * @file functions for generating cards for alexa app
 */

'use strict'

import coreUtils from './coreUtils'

const cardsUtils = {}

cardsUtils.generateCardTitle = (params) => {
    const {
        skillName, decision, book, author
    } = params
    let text = skillName
    const titleAndAuthor = coreUtils.appendBookTitleAndAuthor(book, author)
    if (typeof decision !== 'undefined') text += ` - ${decision}`
    else text += ` - ${titleAndAuthor}`
    return text
  };
  
  cardsUtils.generateCardText = (params) => {
    const {
        intentName, url
    } = params
    let text = this.generateSpeechText().speechOutput
    if (intentName === 'GetBookInfo') {
      text += ` GoodReads URL: ${url}`
    }
    return text
  };
  
  cardsUtils.generateCard = (params) => {
    const {
        cardTitle, cardText, small_image_url, image_url, book, author, decision, skillName, intentName
    } = params
    const card = {
      type: 'Standard',
      title: cardTitle || this.generateCardTitle({ book, author }),
      text: cardText || this.generateCardText({ intentName, url }),
      content: cardText || this.generateCardText({ intentName, url })
    }
    if (intentName === 'GetBookInfo') {
      card.image = {};
      card.type = 'Standard';
      card.image.smallImageUrl = small_image_url;
      card.image.largeImageUrl = image_url;
    }
    return card;
  };

export default cardsUtils
