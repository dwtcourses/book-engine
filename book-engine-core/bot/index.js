/**
 * @author Mukul <@mukul1904>
 */
'use strict';

const alexaLogger = require('../logger');
const { 
    handleBookInfoReq,
    scrapeService 
} = require('../service');

const {
    getAuthor,
    getBookInfo,
    getDescription,
    getSimilarBooks,
    getWeeklyPopularBooks,
    getAllTimePopularBooks
} = require('../createResponse');

const {
    greetingMessage,
    helpMessage,
    errMessage,
    goodbyeMessage,
    aboutBFI,
    contactUsMessage
} = require('../messages');

const elicitSlot = (sessionAttributes, intentName, slots, slotToElicit, message) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,
        },
    };
}

const close = (sessionAttributes, fulfillmentState, message) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

const delegate = (sessionAttributes, slots) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots,
        },
    };
}

const errorHandle= (callback, err) => {
    alexaLogger.logError(err);
    return callback(close({}, 'Fulfilled',
        { contentType: 'PlainText', content: errMessage }));
};

const BotFactory = {};

BotFactory.dispatch = (intentRequest, callback) => {
    alexaLogger.logInfo(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const intentName = intentRequest.currentIntent.name;
    const bookTitle = intentRequest.currentIntent.slots['BookName'];
    const authorName = intentRequest.currentIntent.slots['AuthorName'];
    const operationType = intentRequest.currentIntent.slots['OperationType'];
    const bookGenre = intentRequest.currentIntent.slots['BookGenre'];
    if (intentName === 'BFIBookEngineGetAuthor') {
        return getAuthor({ bookTitle, authorName})
            .then((content) => {
                return callback(close(
                    intentRequest.sessionAttributes, 'Fulfilled', {
                        contentType: 'PlainText',
                        content
                    }
                ));
            })
            .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEngineGetBookDescription') {
        return getBookDescription({ bookTitle, authorName})
            .then((content) => {
                return callback(close(
                    intentRequest.sessionAttributes, 'Fulfilled', {
                        contentType: 'PlainText',
                        content
                    }
                ));
            })
            .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEngineGetBookInfo') {
        return getBookInfo({ bookTitle, authorName})
            .then((content) => {
                return callback(close(
                    intentRequest.sessionAttributes, 'Fulfilled', {
                        contentType: 'PlainText',
                        content
                    }
                ));
            })
            .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEngineGetSimiliarBooks') {
        return getSimilarBooks({ bookTitle, authorName})
            .then((content) => {
                return callback(close(
                    intentRequest.sessionAttributes, 'Fulfilled', {
                        contentType: 'PlainText',
                        content
                    }
                ));
            })
            .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEngineWeeklyBooks') {
        if (operationType === 'most read this week') {
            return getWeeklyPopularBooks({ bookGenre })
                .then((content) => {
                    return callback(close(
                        intentRequest.sessionAttributes, 'Fulfilled', {
                            contentType: 'PlainText',
                            content
                        }
                    ));
                })
                .catch(err => errorHandle(callback, err));
        } else if (operationType === 'most popular') {
            return getAllTimePopularBooks({ bookGenre })
                .then((content) => {
                    return callback(close(
                        intentRequest.sessionAttributes, 'Fulfilled', {
                            contentType: 'PlainText',
                            content
                        }
                    ));
                })
                .catch(err => errorHandle(callback, err));
        }
    }
    else if (intentName === 'BFIBookEngineHelpIntent') {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: helpMessage }));
    } 
    else if (intentName === 'BFIBookEngineStartOverIntent') {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: greetingMessage }));
    } 
    else if (intentName === 'BFIBookEngineGreetingIntent') {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: greetingMessage }));
    } 
    else if (intentName === 'BFIBookEngineStopIntent') {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: goodbyeMessage }));
    } else {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: errMessage }));
    }
};

BotFactory.handleRequest = (event, callback) => {
    try {
        if (event.bot && !event.bot.name) {
            callback('Invalid format');
        }
        alexaLogger.logInfo(`event.bot.name=${event.bot.name}`);
        BotFactory.dispatch(event, (response) => {
            callback(null, response);
        });
    } catch (err) {
        callback(err);
    }
};

module.exports = BotFactory;
