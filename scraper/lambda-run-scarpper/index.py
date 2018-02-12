# -*- coding: utf-8 -*-
__author__ = 'hmharshit'
import urllib.request
from bs4 import BeautifulSoup
from pymongo import MongoClient


genres = [
"Art",
"Biography",
"Business",
"Chick Lit",
"Christian",
"Classics",
"Comics",
"Contemporary",
"Cookbooks",
"Crime",
"Ebooks",
"Fantasy",
"Fiction",
"Gay and Lesbian",
"Graphic Novels",
"Historical Fiction",
"History",
"Horror",
"Manga",
"Memoir",
"Music",
"Mystery",
"Nonfiction",
"Paranormal",
"Philosophy",
"Poetry",
"Psychology",
"Religion",
"Romance",
"Science",
"Science Fiction",
"Suspense",
"Spirituality",
"Sports",
"Thriller",
"Travel",
"Young Adult"
]

class GoodReadsCrawler:
    popular_all_time_books_url = 'https://www.goodreads.com/shelf/show/'
    popular_books_this_week_url = 'https://www.goodreads.com/genres/most_read/'
    response = {
        "most_read_this_week": [],
        "most_popular": [],
    }

    def __init__(self, genre):
        self.popular_all_time_books_url = 'https://www.goodreads.com/shelf/show/' + genre
        self.popular_books_this_week_url = 'https://www.goodreads.com/genres/most_read/' + genre

    def scarpWeeklyPopularBooks(self):
        print("Scrapping weekly most read books")
        soup = self.convert(self.popular_books_this_week_url)
        books = soup.find_all('img', {'class': 'bookImage'})
        for book in books:
            goodreads_id = book.get("src")[35:46]
            self.response.get("most_read_this_week").append(
                {"goodreads_id": goodreads_id,
                 "title": book.get("alt"),
                 "isbn_id": None}
            )
        return self.response

    def scarpMostPopularBooks(self):
        print("Scrapping most popular books")        
        soup = self.convert(self.popular_all_time_books_url)
        books = soup.find_all('a', {'class': 'leftAlignedImage'})
        for book in books:
            self.response.get("most_popular").append(
                {
                    "goodreads_id": book.findChild().get('src')[35:46],
                    "title": book.get("title"),
                    "isbn_id": None})
        return self.response

    def convert(self, url):
        req = urllib.request.Request(url)
        req.add_header('User-Agent',
                       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) '
                       'Chrome/39.0.2171.95 	Safari/537.36')
        resp = urllib.request.urlopen(req).read()
        soup = BeautifulSoup(resp, 'lxml')
        return soup

def scrap(genre, scrapedBooks):
    scraper = GoodReadsCrawler(genre)
    scraper.response['most_read_this_week'] = []
    scraper.response['most_popular'] = []
    scraper.scarpMostPopularBooks()
    scraper.scarpWeeklyPopularBooks()
    scrapedBooks.insert_one({
        'most_read_this_week': scraper.response['most_read_this_week'][0:10],
        'most_popular': scraper.response['most_popular'][0:10],
        'genre': genre
    })

def init():
    client = MongoClient('') #Pass mongo url
    db = client['bfi-book-engine']
    db.authenticate() #pass creds: db.authenticate(<username>, <password>)
    scrapedBooks = db['scraped-books']
    for genre in genres:
        try:
            print('Scraping ' + genre)
            scrap(genre, scrapedBooks)
        except expression as identifier:
            continue
        

init()
