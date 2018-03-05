# Book Engine

This is an open source project under Paytm - Build for India initiative, which will give the recommendation, predictions and search results based on author, genre and book title/ISBN.

This project can used for:
* [Alexa Skill](https://www.amazon.com/Mukul-Jain-BFI-Book-Engine/dp/B079RCSD26/)
* [Chatbot](https://www.facebook.com/BFIBookEngine/)
* [VR App](https://www.youtube.com/watch?v=U6i5Jz3nrc0)

## Getting Started

You can fork or clone the repo to get started. This project has multiple apps, which are loosely couple with each other. Here is what each app's role is:

- book-engine-core - Lambda function, which runs our chatbot, VR app and alexa skill. For how to deploy it on aws, refer deployment guide below.
- kids-classic-books-alexa-skill - Simple prootype/POC for the alexa skill. For more refer the prototype section below.
- scraper: We scrap goodreads to get popular books for genre. We usually run this on weekly basis using any simple cronjob. It's not integrated yet. [Here](https://github.com/PaytmBuildForIndia/book-engine/issues/22) is the issue for this.
- recsys: All the work related to recommendation system goes here.

### Prerequisites

What things you need to install the software and how to install them
- node and npm
- python3
- aws-cli
- a mongo collection, for scraper app to run and save data
- alexa enabled device to run alexa skill (not mandatory)
- AWS account

### Installing

#### Chatbot

Test our chatbot here: https://www.facebook.com/BFIBookEngine/. By default you won't get any response, as it is in develpment, so send me your fb id and I will add you as tester for chatbot.

Chatbot is built using AWS Lex, which invokes [this](https://github.com/PaytmBuildForIndia/book-engine/tree/master/book-engine-core) lambda function on every message. This is build using nodejs.

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

#### Alexa Skill

Skill is avialable in multiple Regions (India, US, UK, Cananda, Australia), and you can find it here https://www.amazon.com/Mukul-Jain-BFI-Book-Engine/dp/B079RCSD26/.

Skill is built using AWS ASK, which invokes [this](https://github.com/PaytmBuildForIndia/book-engine/tree/master/book-engine-core) lambda function on every user-req. This is build using nodejs.

```
Tell me about Harry Potter by JK Rowlings
Who wrote The fault in our stars
Similar books like The Lord of the rings
Give me a short description of The Women on the Train
Most popular mystery books for this week
Most popular horror books for all time
```

#### VR App

[![Click here to see demo of Book Engine - VR version](http://i3.ytimg.com/vi/U6i5Jz3nrc0/maxresdefault.jpg)](https://www.youtube.com/watch?v=U6i5Jz3nrc0)

More instruction coming soon for VR app.

## Prototype
I have created a rough prototype for this project to demonstrate, how it will work. 
- Video Link [here](https://www.youtube.com/watch?v=SSisLp8Z_Ag)
- Source code [here](https://github.com/PaytmBuildForIndia/book-engine/tree/master/kids-classic-books-alexa-skill)
- Documentation [here](https://github.com/PaytmBuildForIndia/book-engine/blob/master/kids-classic-books-alexa-skill/README.md)
- Alexa Skill [here](https://www.amazon.com/dp/B078TLNT39/). This skill was part of Alexa Skills Kids Challenge 2018

## Running the tests and coding style

These are no tests as of now for the project. Feel free to connect with me for discussing the potential tests.

### And coding style tests

For node apps, we use eslint to maintain a coding standard. 
```
npm run lint // will give you lint issues
npm run lintfix // will automatically fix some of the issues
```

## Deployment

* Deploy book-engine-core as lambda function using node-lammbda, aws-cli or any method of your preference. Follow deploy.env.sample to add necessary enviornment variables.

#### Alexa Skill

* Create alexa skill on developers.amazon.com portal and add basic detals and intent schema (connect with me to get intent schema). 
* Pass the ARN id of previously created lambda function.
* In test section, you can test your alexa skill.

#### Chatbot

* [This](https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start) will help you to create bot on facebook. For webhook, we will use lambda function created earlier.
* Follow [this](https://docs.aws.amazon.com/lex/latest/dg/gs-bp-create-bot.html) guide to create your chatbot.
* Same lambda function your created above will be used here.
* Build the bot from aws console and test it from there.
* Publish it to test it on live facebook messenger.

#### VR App

TBD

## Built With

* [node](https://nodejs.org/en/) - For lambda function (alexa skill and chatbot)
* [Python](https://www.python.org/) - For scraper app
* [AWS Sumerian](https://aws.amazon.com/sumerian/) - Only for VR app
* [MongoDB](https://www.mongodb.com/) - For saving the scraped data from goodreads
* [AWS](https://aws.amazon.com/) - AWS Lambda function, Alexa skills kit and Lex.

## Contributing

Issues open - https://github.com/PaytmBuildForIndia/book-engine/issues

## Authors

[Mukul Jain](https://www.twitter.com/mukul1904) (Mentor and developer)

See also the list of [contributors](https://github.com/PaytmBuildForIndia/book-engine/graphs/contributors) who participated in this project.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](https://github.com/PaytmBuildForIndia/book-engine/blob/master/LICENSE) file for details

## Acknowledgments

* Alexa protoypes by @alexadevs and great knowledge sessions by developers at Amazon like [Ankit Kala](https://twitter.com/ankitkala99)
* Thanks to [Kyle](https://twitter.com/kylemroche) for giving access of AWS Sumerian in preview phase
