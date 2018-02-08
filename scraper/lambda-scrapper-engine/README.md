# Lambda Scrapper Engine

Engine to call scarper lambda manually after a fix interval of time.
We can do this by weekly cron job, but we will invoke this manually for now.

# Setup

### Server-side
* [Python 3.5+](http://www.python.org): The language of choice.

* From inside the repository, run:

    `pip install -r requirements.txt`

* Create `event.json` in root.

### Local testing

Run this command from root:
`python-lambda-local  index.py event.json`