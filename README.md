# book-engine
This is an open source project under Paytm - Build for India initiative, which will give the recommendation, predictions and search results based on author, genre and book title/ISBN

## Working Features

I have created a rough prototype for this project to demonstrate, how it will work. 
- Video Link [here](https://www.youtube.com/watch?v=SSisLp8Z_Ag)
- Source code [here](https://github.com/PaytmBuildForIndia/book-engine/tree/master/kids-classic-books-alexa-skill)
- Documentation [here](https://github.com/PaytmBuildForIndia/book-engine/blob/master/kids-classic-books-alexa-skill/README.md)
- Alexa Skill [here](https://www.amazon.com/dp/B078TLNT39/). This skill was part of Alexa Skills Kids Challenge 2018

Test our chatbot here: https://www.facebook.com/BFIBookEngine/. By default you won't get any response, as it is in develpment, so send me your fb id and I will add you as tester for chatbot.

## Future Scope and Plans

I have lots of things in the pipeline, which I will try to integrate into this skill.

- Recomendation System, i.e, based on books requested by user, this skill will be able to suggest books to that user
- Gets data for Bestsellers
- List of books from author, the one user requested
- Get description and similar books directly in alexa skill
- ESLint tested code, currently it is not
- Use of ECMAScriptX
- Better and automated release process

Feel free to let me know of more feature you want to add in it by creating feature request.
Also check our "issues" section, if you want to contribute.

## Contribution Guide

### Tech Stack

- We are currently using nodejs and python, and are open to any technlogy. For alexa skill we have used Alexa Skills Kit and for chatbot, AWS Lex. We have used AWS Lambda functions heavily, as they power both Alexa skills and chatbot.

- For database, we have used MongoDB.

- For nodejs we use ESLint to help make our code clean.

### Alexa Skills

Skill is built using AWS ASK, which invokes [this](https://github.com/PaytmBuildForIndia/book-engine/tree/master/book-engine-alexa-skill) lambda function on every user-req. This is build using nodejs.

```
Ask book engine, to tell me most popular business books of all time
Ask book engine, to tell me most read young adult books for this week
Ask book engine, to tell me about The Harry Potter
```

### Chatbot

Chatbot is built using AWS Lex, which invokes [this](https://github.com/PaytmBuildForIndia/book-engine/tree/master/book-engine-bot) lambda function on every message. This is build using nodejs.

What type of requests chatbot can answer right now:
```
1. Tell me about Harry Potter by JK Rowlings 
2. Tell me about The Jungle book
3. Who is author of The fault in our stars
4. Similar books like The Lord of the rings
5. Give me a short description of The Women on the Train
6. Tell me most popular books of young adult type
7. Tell me most read this week books of mystery type
```

### Run apps in local enviornment

TBD

## Contributors

- [Mukul Jain](https://www.twitter.com/mukul1904) (Mentor and developer)
- [Hitesh Nankani](https://twitter.com/hiteshn97)
- [Harshit](https://twitter.com/hmharshitharsh)
