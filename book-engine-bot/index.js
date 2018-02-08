/**
 * @author Mukul <@mukul1904>
 */
'use strict';

const alexaLogger = require('./logger');
const{ handleReq, scrapeService } = require('./service');

const helpMessage = 'Here\'s what you can ask book-engine-bot: \n'+
                    '1. Tell me about Harry Potter by JK Rowlings \n' +
                    '2. Tell me about The Jungle book\n' +
                    '3. Who is author of The fault in our stars\n' +
                    '4. Similar books like The Lord of the rings\n' +
                    '5. Give me a short description of The Women on the Train\n' +
                    '6. Tell me most popular books of contemporary type\n' +
                    '7. Tell me most read this week books of mystery type\n\n' ;

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
        { contentType: 'PlainText', content: 'Something went wrong. Please try again later.' }));
}

const getAuthor = (intentRequest, callback) => {
    return handleReq(intentRequest)
        .then((resp) => {
            const {
                bookTitle,
                author
            } = resp; 
            return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: `Author of ${bookTitle} is ${author}` }));
        })
        .catch((err) => errorHandle(callback, err));
}

const getBookDescription = (intentRequest, callback) => {
    return handleReq(intentRequest)
        .then((resp) => {
            const {
                bookTitle,
                bookDesc,
                author
            } = resp; 
            return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: `${bookTitle} from ${author} 's brief description is :: ${bookDesc} ` }));
        })
        .catch((err) => errorHandle(callback, err));
}

const getBookInfo = (intentRequest, callback) => {
    return handleReq(intentRequest)
        .then((resp) => {
            const {
                bookTitle,
                bookDesc,
                publication_year,
                publisher,
                average_rating,
                ratings_count,
                author,
                popular_shelves,
                num_pages
            } = resp;
            const content = `${bookTitle} from ${author} was published in ${publication_year} by publisher ${publisher}. `
            + `It consists of ${num_pages} pages. `
            + `Its average rating on Goodreads is ${average_rating} from ${ratings_count} ratings.`;
            return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content }));
        })
        .catch((err) => errorHandle(callback, err));
}

const getSimilarBooks = (intentRequest, callback) => {
    return handleReq(intentRequest)
        .then((resp) => {
            const {
                bbookTitle,
                bookDesc,
                publication_year,
                publisher,
                average_rating,
                ratings_count,
                author,
                popular_shelves,
                similar_books,
                num_pages
            } = resp;

            if (!similar_books.length) return `We do not have any books similar to ${bookName}`;
            let text = 'List of similar books: ';
            for (let index = 0; index < similar_books.length; index++) {
                const bookItem = similar_books[index];
                text += `${bookItem.title}, `;
            }
            return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: text }));
        })
        .catch((err) => errorHandle(callback, err));
}

const getBFIBookEngineWeeklyBooks = (intentRequest, callback) => {
    return scrapeService(intentRequest)
        .then((resp) => {
            const {
                response
            } = resp;
            return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: response }));
        })
        .catch((err) => errorHandle(callback, err));
}

const dispatch = (intentRequest, callback) => {
    alexaLogger.logInfo(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const intentName = intentRequest.currentIntent.name;
    if (intentName === 'BFIBookEngineGetAuthor') {
        return getAuthor(intentRequest, callback);
    }
    else if (intentName === 'BFIBookEngineGetBookDescription') {
        return getBookDescription(intentRequest, callback);
    }
    else if (intentName === 'BFIBookEngineGetBookInfo') {
        return getBookInfo(intentRequest, callback);
    }
    else if (intentName === 'BFIBookEngineGetSimiliarBooks') {
        return getSimilarBooks(intentRequest, callback);
    }
    else if (intentName === 'BFIBookEngineHelpIntent') {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: helpMessage }));
    } 
    else if (intentName === 'BFIBookEngineStartOverIntent') {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: 'Hey, how are you? What book you have in mind? Say "help" for sample phrases' }));
    } 
    else if (intentName === 'BFIBookEngineStopIntent') {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
            { contentType: 'PlainText', content: 'Valar Morghulis!\n Thank you for using BFI Book Engine Bot' }));
    }
    else if (intentName === 'BFIBookEngineWeeklyBooks') {
        return getBFIBookEngineWeeklyBooks(intentRequest, callback);
    }
    else {
        return callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: messages.messageInvalidRequest() }));
    }
}

exports.handler = (event, context, callback) => {
    try {
        alexaLogger.logInfo(`event.bot.name=${event.bot.name}`);
        dispatch(event, (response) => {
            console.log(response);
            callback(null, response)
        } )
    } catch (err) {
        callback(err);
    }
};