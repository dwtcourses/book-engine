'use strict'

const GOODREADS_KEY = process.env.GOODREADS_KEY;

const coreUtils = {}

coreUtils.appendBookTitleAndAuthor = (params) => {
  const { book, author } = params;
  let title = book;
  if (author) title += ` from ${author}`;
  return title;
}

coreUtils.validateRequest = (author, title) => !author && !title

coreUtils.generateEndPointAndCardTitle = (params) => {
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

export default coreUtils
