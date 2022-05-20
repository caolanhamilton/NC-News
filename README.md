# What is  Northcoders News?

Northcoders News is an API designed to be the backend of a news app with similar functionality to Reddit.com. The API interacts with data representing articles, comments, users and topics. 

The API allows:

 - Retrieving articles, topics, usernames and comments
 - Searching for articles by an identifier 
 - Sorting and ordering articles 
 - Filtering articles by topic
 - Voting on articles
 - Writing new comments 
 - Deleting comments

## Live version!

You can find Northcoders news hosted on Heroku here:

[https://ncnewscaolanhamilton.herokuapp.com/api](https://ncnewscaolanhamilton.herokuapp.com/api)

You can view the app using any modern browser such as Chrome. When first opening the app you can see a list of available endpoints and what they do. Simply copy the endpoint to the browser address bar and paste it after api/. To make POST, PATCH or DELETE requests you can use the Insomnia app available here: 

[https://insomnia.rest/](https://insomnia.rest/)

## Cloning

To clone this repo you can run the following code snippet in your terminal whilst inside the directory you wish to clone into:

    git clone https://github.com/caolanhamilton/NC-News

## Install Dependencies

Once you have a local copy of the repo you will need to install a few dependencies. I have listed these packages below along with the command to install them:

 - jest: `npm  install -d jest`
 - jest-extended `npm install -d jest-extended`
 - jest-sorted `npm install -d est-sorted`
 - supertest `npm install -d supertest`
 - dotenv `npm install dotenv` 
 - express `npm install express`
 - pg `npm install pg`
    

## Setting up & seeding the database locally

First, you must set up the database by running: 
`setup-dbs`

You can then seed the database using:

    npm run seed

## Setting up environment files

You must also set up the necessary environment variables before you can run the app. Follow these steps:

1. Create a new .env file called ".env.test" and add the following line: "PGDATABASE=nc_news_test"

2. Create a second .env file called ".env.development" and add the following line: "PGDATABASE=nc_news"

## Testing

The test suite for this app is located in the tests folder. You can run the tests with the following command:

    npm t __tests__/app.test.js    

## Minimum requirements 

Northcoders News was made using node v17.1.0 and Postgres 14. It is recommended you use at least these versions to run the app locally. 