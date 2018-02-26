/**
 * @author Mukul <@mukul1904>
 */
'use strict';

const alexaLogger = require('../logger');
const { 
    handleBookInfoReq,
    scrapeService,
    genres
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
    contactUsMessage,
    missingBook,
    repromptMessage
} = require('../messages');

const helpAlexaMessage = '<speak>Here\'s what you can ask book-engine: \n, <break time="0.5s"/> '+
'Tell me about Harry Potter by JK Rowlings \n, <break time="0.5s"/> '+
'Who wrote The fault in our stars\n, <break time="0.5s"/> ' +
'Similar books like The Lord of the rings\n, <break time="0.5s"/> ' +
'Give me a short description of The Women on the Train\n,<break time="0.5s"/> ' +
'Most popular mystery books for this week\n,<break time="0.5s"/> ' +
'Most popular horror books for all time\n\n</speak>';

const appendBookTitleAndAuthor = (params) => {
    const { bookTitle, authorName, useSession, intent } = params;
    if (useSession) {
        const {
            book, author
        } = intent.session.attributes;
        let title = book.title;
        if (author.name) title += ` from ${author.name}`;
        return title;
    } else {
        let title = bookTitle;
        if (authorName) title += ` from ${authorName}`;
        return title;
    }
}

const buildResponse = (sessionAttributes, speechletResponse) => {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

const delegate = (title, output, repromptText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: title,
            content: output,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession
    };
};

const close = (title, output) => {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: title,
            content: output,
        },
        reprompt: null,
        shouldEndSession: true
    };
};

const errorHandle= (callback, err) => {
    alexaLogger.logError(err);
    return callback({}, close({}, 'Fulfilled',
        { contentType: 'PlainText', content: errMessage }));
};

const AlexaSkillFactory = {};

AlexaSkillFactory.handleIntentRequest = (intentRequest, useSession=false, callback) => {
    const intentName = intentRequest.request.intent.name;
    let bookGenre;
    let bookTitle;
    let authorName;
    if (intentRequest.request.intent.slots && intentRequest.request.intent.slots['BookName']) {
        bookTitle = intentRequest.request.intent.slots['BookName'].value;
    }
    if (intentRequest.request.intent.slots && intentRequest.request.intent.slots['AuthorName']) {
        authorName = intentRequest.request.intent.slots['AuthorName'].value;
    }
    if (intentRequest.request.intent.slots && intentRequest.request.intent.slots['BookGenre']) {
        bookGenre = intentRequest.request.intent.slots['BookGenre'].value;   
    }
    if (intentName === 'BFIBookEngineGetBookInfo') {
        return getBookInfo({ bookTitle, authorName, useSession, intent: intentRequest })
            .then((response) => {
                let { content, session } = response;
                session.nextIntent = 'BFIBookEngineGetBookDescription';
                content += ` Do you want to know more about ${appendBookTitleAndAuthor({bookTitle, authorName, useSession, intent: intentRequest})}?`;
                return callback({
                    sessionAttributes: session,
                    title: `Book Engine ${appendBookTitleAndAuthor({bookTitle, authorName, useSession, intent: intentRequest})}`, output: content, repromptMessage, shouldEndSession: false
                });
            })
            .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEngineGetBookDescription') {
        return getDescription({ bookTitle, authorName, useSession, intent: intentRequest })
            .then((response) => {
                let { content, session } = response;
                session.nextIntent = 'BFIBookEngineGetSimiliarBooks';
                content += ` Do you want to know similar books like ${appendBookTitleAndAuthor({bookTitle, authorName, useSession, intent: intentRequest})}?`;
                return callback({
                    sessionAttributes: session,
                    title: `Book Engine: More about ${appendBookTitleAndAuthor({bookTitle, authorName, useSession, intent: intentRequest})}`, output: content, repromptMessage, shouldEndSession: false
                });
            })
            .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEngineGetSimiliarBooks') {
        return getSimilarBooks({ bookTitle, authorName, useSession, intent: intentRequest })
            .then((response) => {
                let { content, session } = response;
                session.nextIntent = null;
                content += ' Thanks for using Book Engine. Please let us know your feedback.';
                return callback({
                    sessionAttributes: session,
                    title: `Book Engine: Similar books like ${appendBookTitleAndAuthor({bookTitle, authorName, useSession, intent: intentRequest})}`, output: content, repromptMessage, shouldEndSession: true
                });
            })
            .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEngineGetAuthor') {
        return getAuthor({ bookTitle, authorName, useSession, intent: intentRequest })
            .then((response) => {
                let { content, session } = response;
                session.nextIntent = 'BFIBookEngineGetBookDescription';
                content += ` Do you want to know more about ${appendBookTitleAndAuthor({bookTitle, authorName, useSession, intent: intentRequest})}?`;
                return callback({
                    sessionAttributes: session,
                    title: `Book Engine: Author of ${bookTitle}`, output: content, repromptMessage, shouldEndSession: false
                });
            })
            .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEngineWeeklyBooks') {
        return getWeeklyPopularBooks({ bookGenre })
                .then((response) => {
                    let { content, confirmIntent } = response;
                    intentRequest.session.attributes.nextIntent = 'BFIBookEngineGetSupportedGenres';
                    if (confirmIntent) {
                        return callback({
                            sessionAttributes: intentRequest.session.attributes,
                            title: `Book Engine supported genres`, output: content, repromptMessage, shouldEndSession: false
                        });
                    }
                    return callback({
                        sessionAttributes: intentRequest.session.attributes,
                        title: `Most read ${bookGenre} books for this week`, output: content, repromptMessage, shouldEndSession: false
                    });
                })
                .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEnginePopularBooks') {
        return getAllTimePopularBooks({ bookGenre })
                .then((response) => {
                    let { content, confirmIntent } = response;
                    intentRequest.session.attributes.nextIntent = 'BFIBookEngineGetSupportedGenres';                    
                    if (confirmIntent) {
                        return callback({
                            sessionAttributes: intentRequest.session.attributes,
                            title: `Book Engine supported genres`, output: content, repromptMessage, shouldEndSession: false
                        });
                    }
                    return callback({
                        sessionAttributes: intentRequest.session.attributes,
                        title: `All time popular ${bookGenre} books for this week`, output: content, repromptMessage, shouldEndSession: false
                    });
                })
                .catch(err => errorHandle(callback, err));
    }
    else if (intentName === 'BFIBookEngineGetSupportedGenres') {
        return callback({ sessionAttributes: {}, title: 'Supported Genres Book Engine', output: genres.toString(), repromptMessage, shouldEndSession: true });
    }
    else if (intentName === 'BFIBookEngineGreetingIntent') {
        return callback({ sessionAttributes: {}, title: 'Welcome to BFI: Book Engine', output: greetingMessage, repromptMessage, shouldEndSession: false });
    }
    else if (intentName === 'AMAZON.StopIntent') {
        return callback({ sessionAttributes: {}, title: 'Thank you for using BFI: Book Engine', output: goodbyeMessage, repromptMessage: null, shouldEndSession: true });
    }
    else if (intentName === 'AMAZON.CancelIntent') {
        return callback({ sessionAttributes: {}, title: 'Thank you for using BFI: Book Engine', output: goodbyeMessage, repromptMessage: null, shouldEndSession: true });
    }
    else if (intentName === 'AMAZON.NoIntent') {
        return callback({ sessionAttributes: {}, title: 'Thank you for using BFI: Book Engine', output: goodbyeMessage, repromptMessage: null, shouldEndSession: true });
    }
    else {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: errMessage }));
    }
};

AlexaSkillFactory.dispatch = (intentRequest, callback) => {
    alexaLogger.logInfo(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.request.type}`);
    return new Promise((resolve) => {
        switch (intentRequest.request.type) {
          case 'LaunchRequest':
            return callback({}, delegate('Welcome to BFI: Book Engine', greetingMessage, repromptMessage, false));
            break;
          case 'IntentRequest':
            if (intentRequest.request.intent.name === 'AMAZON.YesIntent') {
                const nextIntent = intentRequest.session.attributes.nextIntent;
                if (!nextIntent) {
                    return callback(sessionAttributes, close('Book Engine Goodbye', 'Something went wrong. Please try again later or contact us on Twitter'));
                }
                intentRequest.request.intent.name = nextIntent;
                AlexaSkillFactory.handleIntentRequest(intentRequest, true, (resp) => {
                    const {
                      sessionAttributes, title, output, repromptMessage, shouldEndSession
                    } = resp;
                    return callback(sessionAttributes, delegate(title, output, repromptMessage, shouldEndSession));
                });
            } 
            else if (intentRequest.request.intent.name === 'AMAZON.HelpIntent') {
                return callback(
                    {}, {
                        outputSpeech: {
                            type: 'SSML',
                            ssml: helpAlexaMessage,
                        },
                        card: {
                            type: 'Simple',
                            title: 'Help - BFI: Book Engine',
                            content: helpAlexaMessage.replace(/<(.|\n)*?>/g, ""),
                        },
                        reprompt: {
                            outputSpeech: {
                                type: 'PlainText',
                                text: repromptMessage,
                            },
                        },
                        shouldEndSession: false
                    }
                )
            }
            else {
                AlexaSkillFactory.handleIntentRequest(intentRequest, false, (resp) => {
                    const {
                      sessionAttributes, title, output, repromptMessage, shouldEndSession
                    } = resp;
                    return callback(sessionAttributes, delegate(title, output, repromptMessage, shouldEndSession));
                });
            }
            break;
          case 'SessionEndedRequest':
            return callback({}, close('Thank you for using BFI: Book Engine', goodbyeMessage));
            break;
          default:
            break;
        }
    });
};


AlexaSkillFactory.handleRequest = (event, callback) => {
    try {
        AlexaSkillFactory.dispatch(event, (sessionAttributes, speechletResponse) => {
            callback(null, buildResponse(sessionAttributes, speechletResponse));
        });
    } catch (err) {
        callback(err);
    }
};

module.exports = AlexaSkillFactory;
