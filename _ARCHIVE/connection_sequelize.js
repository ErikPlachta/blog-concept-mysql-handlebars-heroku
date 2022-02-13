//-- IMPORTS
const Sequelize = require('sequelize'); // for drop add tables in employee_db
require('dotenv').config(); //-- for local variable caching

/*
  Create connection to our database, pass in your MySQL information for username
    and password.
*/

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} 
else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    },
    console.log(`//-- Connection MYSQL database with npm package Sequelize success!`)
  );
}

//-- exporting created sequelize obj
module.exports = sequelize;
