# -*- coding: utf-8 -*-
__author__ = 'hmharshit'
import urllib.request
from bs4 import BeautifulSoup


class GoodReads:
    __popular_all_time_books_url = 'https://www.goodreads.com/shelf/show/{genre}'
    __popular_books_this_week_url = 'https://www.goodreads.com/genres/most_read/{genre}'
    __response = response = {
        "new_releases": [],
        "most_read_this_week": [],
        "most_popular": [],
    }

    def scarpWeeklyPopularBooks(self, genre):
        soup = self.convert(self.__popular_books_this_week_url.format(genre=genre))
        books = soup.find_all('img', {'class': 'bookImage'})
        for book in books:
            goodreads_id = book.get("src")[35:46]
            self.__response.get("most_read_this_week").append(
                {"goodreads_id": goodreads_id,
                 "title": book.get("alt"),
                 "isbn_id": None}
            )
        return self.__response

    def scarpMostPopularBooks(self, genre):
        soup = self.convert(self.__popular_all_time_books_url.format(genre=genre))
        books = soup.find_all('a', {'class': 'leftAlignedImage'})
        for book in books:
            self.__response.get("most_read_this_week").append(
                {
                    "goodreads_id": book.findChild().get('src')[35:46],
                    "title": book.get("title"),
                    "isbn_id": None})
        return self.__response

    def convert(self, url):
        req = urllib.request.Request(url)
        req.add_header('User-Agent',
                       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) '
                       'Chrome/39.0.2171.95 	Safari/537.36')
        resp = urllib.request.urlopen(req).read()
        soup = BeautifulSoup(resp, 'lxml')
        return soup


if __name__ == "__main__":
    print(GoodReads().scarpMostPopularBooks('business'))
    print("\n\n\n\n")
    print(GoodReads().scarpWeeklyPopularBooks('business'))

