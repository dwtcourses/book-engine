# This script will call scrapper-lambda for each genre
# for now we've hardcoded the genres, to limit the lambda requests

__author__ = 'myke11j'

genres = [
"art",
"Biography",
"Business",
"Chick Lit",
"Children's",
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
"History,"
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

def invokeLambda(genre):
    print("invoking lambda for genre " + genre)

def init():
    for genre in genres:
        genre = genre.lower()
        invokeLambda(genre)

init()