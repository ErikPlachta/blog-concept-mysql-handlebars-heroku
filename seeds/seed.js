/*
  Run this with the bash command `npm run seed` 

  This purges the database and then creates clean data based on models, and the
  seed data in root
    seed_Hero.json
    Seed_User.json

*/

//------------------------------------------------------------------------------
//-- Building seed database with mysql2 

async function seedDatabase () {
  require('dotenv').config(); //-- for local variable caching

  const db = require('../config/connection_mysql2')
  // execute in parallel, next console.log in 3 seconds
  try {
    await Promise.all([
      db.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`),
      db.query('select sleep(2)'),
      db.query(`CREATE DATABASE ${process.env.DB_NAME}`),
    ]);
    
    await db.end(); //-- Close connection
    return true; //-- return true as promise
  }
  catch (err) { 
    console.log(err);
    await db.end(); //-- Close connection
    return false; //-- return true as promise
  };

}

//------------------------------------------------------------------------------
//-- Building seed tables with Sequelize based on Model data and seed JSON data
async function seedTables() {

  //-- Used to build SQL seed data, and erase anything that may exist
  const sequelize = require('../config/connection');

  //-- Grab database Table models
  const { User, Post, Comment, Resource } = require('../models');

  //-- Grab seed data to build a seed database
  const seed_Users = require('./seed_User.json');
  const seed_Posts = require('./seed_Post.json');
  const seed_Comments = require('./seed_Comment.json');
  const seed_Resources = require('./seed_Resource.json');

  //-- wait for connection to database
  await sequelize.sync({ force: true });

  // -- Grab all users and build Table based on Model
  const users = await User.bulkCreate(seed_Users, 
    {
      individualHooks: true,
      returning: true,
    }
  );
  
  console.log(`\n//-- Created Users\n`)
  console.log(`//-----------------------------------------------------------\n`)
  
  // //-- grab all KBAs and build Table based on Model
  for (const post of seed_Posts) {
    const newPost = await Post.create({
    ...post,
    });
  }

  console.log(`\n//-- Created Posts\n`)
  console.log(`//-----------------------------------------------------------\n`)

    // //-- grab all KBAs and build Table based on Model
    for (const comment of seed_Comments) {
      const newComment = await Comment.create({
      ...comment,
      });
    }
  
    console.log(`\n//-- Created Posts\n`)
    console.log(`//-----------------------------------------------------------\n`)

  //  //-- grab all Resources and build Table based on Model
   for (const resource of seed_Resources) {
    const newResource = await Resource.create({
    ...resource,
    });

    console.log(`\n//-- Created Resources!\m`)
    console.log(`//-----------------------------------------------------------\n`)
  }


  //-- exit once done building seed database data
  // process.exit(0);
  
};


//------------------------------------------------------------------------------
//-- RUNNIUNG

const seed = async () => {

  seedDatabase()
    .then( results => console.log(`//-- database creation successful: ${results}`))
    .then(() => seedTables())
    .then( () => process.exit(0))
    //-- print error
    .catch(console.log)
};

//------------------------------------------------------------------------------
//-- RUNNING 

seed();

// seedDatabase();

