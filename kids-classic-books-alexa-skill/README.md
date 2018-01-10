## Prototype for Book Engine Project

This is simply an Alexa Skill, which can fetch book information for kids. Kids can ask for book by title and author or just by title.

## Inspiration

As a bibliophile, I wanted my Echo to tell me about books I want to read. It's rating, small description, publication year and much more. It's little easier than "googling it", as I can just ask for kids book to Alexa.

## What it does

It can retrieve any book's details from Goodreads which is labeled as children. User can ask this skill for any book, either by title or title and author, and this skill will return with some basic details like
- Publisher Name
- Publisher Year
- Goodreads review count and rating
- Description
- List of similar books etc

If the book is not labeled as children book, then it will prompt the user and will ask to request some other book. So, a kid can't retrieve information for a book, unless it's a Children Book.

Sample utterances: 
- Alexa, ask kids classic, information for The Harry Potter by JK Rowlings
- Alexa, ask kids classic, information for The Great Wizard Wars from Christina Clorry
- Alexa, ask kids classic, to tell me about Where the Wild Things Are

## How I built it

I have used Nodejs, javascript and my own npm package [goodreads-json-api](https://www.npmjs.com/package/goodreads-json-api)

Based on user's request, I form the API and parse the response which can then be passed on to the user.

## Challenges I ran into

- Goodreads by default returns XML response, which is not that great for Lambda function. So, I created a custom package which can parse this xml and can return JSON friendly response.
- Parsing CDATA and XML tags was little tricky.
- Creating right user-voice experience was also one of highest priority while building this skill. Though, I'm still working on making this skill's voice experience even better for kids.
