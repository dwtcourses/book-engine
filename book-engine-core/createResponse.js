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

const getAuthor = (params) => {
    const {
        authorName, bookTitle
    } = params;
    return new Promise((resolve, reject) => {
        return handleBookInfoReq({ authorName, bookTitle })
            .then((resp) => {
                const {
                    book,
                    author
                } = resp;
                return resolve(`Author of ${book.title} is ${author.name}`);
            })
            .catch((err) => reject(err));
    });
};

const getBookInfo = (params) => {
    const {
        authorName, bookTitle
    } = params;
    return new Promise((resolve, reject) => {
        return handleBookInfoReq({ authorName, bookTitle })
            .then((resp) => {
                const {
                    popular_shelves, book, author, similar_books
                } = resp;
                if (!book.title || typeof book.title === 'undefined') {
                    return resolve('Requested book was not found on Goodreads');
                }
                const content = `${book.title} from ${author.name} was published in ${book.publication_year} by publisher ${book.publisher}. `
                + `It consists of ${book.num_pages} pages. `
                + `Its average rating on Goodreads is ${book.average_rating} from ${book.ratings_count} ratings.`;
                return resolve(content);
            })
            .catch((err) => reject(err));
    });
};

const getDescription = (params) => {
    const {
        authorName, bookTitle
    } = params;
    return new Promise((resolve, reject) => {
        return handleBookInfoReq({ authorName, bookTitle })
            .then((resp) => {
                const {
                    popular_shelves, book, author, similar_books
                } = resp;
                return resolve(`${book.title} from ${author.name} 's brief description is :: ${book.description}`);
            })
            .catch((err) => reject(err));
    });
};

const getSimilarBooks = (params) => {
    const {
        authorName, bookTitle
    } = params;
    return new Promise((resolve, reject) => {
        return handleBookInfoReq({ authorName, bookTitle })
            .then((resp) => {
                const {
                    popular_shelves, book, author, similar_books
                } = resp;
                if (!similar_books.length) return `We do not have any books similar to ${bookName}`;
                let text = 'List of similar books: ';
                for (let index = 0; index < similar_books.length; index++) {
                    const bookItem = similar_books[index];
                    text += `${bookItem.title}, `;
                }
                return resolve(text);
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
                    response
                } = resp;
                return resolve(response);
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
                    response
                } = resp;
                return resolve(response);
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
