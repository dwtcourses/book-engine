/**
 * @author Mukul <@mukul1904>
 * @description
 */

'use strict';

const alexaLogger = require('./logger');
const { 
    handleBookInfoReq,
    scrapeService 
} = require('./service');
const {
    missingBook
} = require('./messages');

const handleSession = (params) => {
    return new Promise((resolve) => {
        const { intent } = params;
        return resolve(intent.session.attributes);
    });
};

const getAuthor = (params) => {
    const {
        authorName, bookTitle, useSession
    } = params;
    const execFunct = (useSession) ? handleSession : handleBookInfoReq;
    return new Promise((resolve, reject) => {
        return execFunct(params)
            .then((resp) => {
                if (!resp) {
                    return resolve({
                        content: missingBook(bookTitle)
                    });
                }
                const {
                    book,
                    author,
                    similar_books
                } = resp;
                return resolve({
                    content: `Author of ${book.title} is ${author.name}.`,
                    session: { book, author, similar_books }
                });
            })
            .catch((err) => reject(err));
    });
};

const getBookInfo = (params) => {
    const {
        authorName, bookTitle, useSession
    } = params;
    const execFunct = (useSession) ? handleSession : handleBookInfoReq;
    return new Promise((resolve, reject) => {
        return execFunct(params)
            .then((resp) => {
                if (!resp) {
                    return resolve({
                        content: missingBook(bookTitle)
                    });
                }
                const {
                    popular_shelves, book, author, similar_books
                } = resp;
                if (!book.title || typeof book.title === 'undefined') {
                    return resolve({
                        content: missingBook(bookTitle),
                        session: { book, author, similar_books }
                    });
                }
                const content = `${book.title} from ${author.name} was published in ${book.publication_year} by publisher ${book.publisher}. `
                + `It consists of ${book.num_pages} pages. `
                + `Its average rating on Goodreads is ${book.average_rating} from ${book.ratings_count} ratings.`;
                return resolve({
                    content,
                    session: { book, author, similar_books }
                });
            })
            .catch((err) => reject(err));
    });
};

const getDescription = (params) => {
    const {
        authorName, bookTitle, useSession
    } = params;
    const execFunct = (useSession) ? handleSession : handleBookInfoReq;
    return new Promise((resolve, reject) => {
        return execFunct(params)
            .then((resp) => {
                if (!resp) {
                    return resolve({
                        content: missingBook(bookTitle)
                    });
                }
                const {
                    popular_shelves, book, author, similar_books
                } = resp;
                return resolve({
                    content: `${book.title} from ${author.name} 's brief description is :: ${book.description}.`,
                    session: { book, author, similar_books }
                });
            })
            .catch((err) => reject(err));
    });
};

const getSimilarBooks = (params) => {
    const {
        authorName, bookTitle, useSession
    } = params;
    const execFunct = (useSession) ? handleSession : handleBookInfoReq;
    return new Promise((resolve, reject) => {
        return execFunct(params)
            .then((resp) => {
                if (!resp) {
                    return resolve({
                        content: missingBook(bookTitle)
                    });
                }
                const {
                    popular_shelves, book, author, similar_books
                } = resp;
                if (!similar_books.length) return `We do not have any books similar to ${bookName}`;
                let text = 'List of similar books: ';
                for (let index = 0; index < similar_books.length; index++) {
                    const bookItem = similar_books[index];
                    text += `${bookItem.title}, `;
                }
                return resolve({
                    content: text,
                    session: { book, author, similar_books }
                });
            })
            .catch((err) => reject(err));
    });
}

const getWeeklyPopularBooks = (params) => {
    const {
        bookGenre
    } = params;
    return new Promise((resolve, reject) => {
        return scrapeService({ type: 'most read this week', bookGenre })
            .then((resp) => {
                const {
                    response,
                    confirmIntent
                } = resp;
                return resolve({
                    content: response,
                    confirmIntent
                });
            })
            .catch((err) => reject(err));
    });
}

const getAllTimePopularBooks = (params) => {
    const {
        bookGenre
    } = params;
    return new Promise((resolve, reject) => {
        return scrapeService({ type: 'most popular', bookGenre })
            .then((resp) => {
                const {
                    response,
                    confirmIntent
                } = resp;
                return resolve({ content: response, confirmIntent });
            })
            .catch((err) => reject(err));
    });
}

module.exports = {
    getAuthor,
    getBookInfo,
    getDescription,
    getSimilarBooks,
    getWeeklyPopularBooks,
    getAllTimePopularBooks
};
