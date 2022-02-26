//------------------------------------------------------------------------------
//-- Express
const express = require('express');
const path = require('path'); //-- access to stylesheet within express app for Handlebars.js

//-- Session & Handlebars
const session = require('express-session');
//-- for creation session records
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//-- assigning helper function route to handlebars and onboarding
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({helpers});

const routes = require('./controllers/');
const sequelize = require('./config/connection');

//-- Preparing express server app
const app = express();
const PORT = process.env.PORT || 3001;

//-- session env
const sess = {
  // TODO:: REMOVE THIS ASAP!
  secret: process.env.SECRET_TECH_BLOG,
  cookie: {
    // Session expires after 1 min of inactivity.
    expires: 60000
  },
  // Forces the session to be saved
  // back to the session store
  resave: true,
  // Forces a session that is "uninitialized"
  // to be saved to the store
  saveUninitialized: false,
  store: new SequelizeStore({ db: sequelize  })
};



//-- onboarding Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//-- Allowing use of JSON
app.use(express.json());
//-- Allowing URL encoding for express
app.use(express.urlencoded({ extended: true }));

//-- Building association to Express and public folder
app.use(express.static(path.join(__dirname, 'public'))); 

//-- Onboarding the secure sessions functionality
app.use(session(sess));

//-- Give routes to Express app
app.use(routes);

//------------------------------------------------------------------------------
//-- Create Database Connection

//-- use xisting tables if exist, start connection to express and SQL
sequelize.sync({ force: false }).then(() => {
// sequelize.sync({ force: true }).then(() => { //-- Overvwrite existing tables if exist, start connection to express and SQL
  app.listen(PORT, () => console.log(`Now listening on http://127.0.0.1:${PORT}`));
});

// turn on connection to db and server
/* 
    - { force: true } == database connection must sync with the model definitions and
     associations.
    
     - By forcing the sync method to true, we will make the tables re-create if
    there are any association changes.

 */