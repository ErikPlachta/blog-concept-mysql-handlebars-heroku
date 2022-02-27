const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth.js')


//-- Get non-sensitive user data
router.get('/', async (req,res) => {

  try {
    // if NOT logged in, exclude details.
    if(!req.session.loggedIn){ 
      console.log("//-- not logged in")
      const dbUserData = await User.findAll({
        attributes: {
          exclude: ['password','email','modified_date','created_date','username','name']  
        },
      });
      
      res
      .status(200)
      .json({ users: dbUserData });
    }

    //-- If logged-in, include more details
    if(req.session.loggedIn) {
      console.log("//-- logged in")
      const dbUserData = await User.findAll({
        attributes: {
          exclude: ['password','email','modified_date','name']
          
        },
      });
      
      res
      .status(200)
      .json({ users: dbUserData });
    };
  }
  catch(err){
    res.status(500).json({ error: err['errors'][0].message });
  }
      
});

//-- Users able to update their own unique data.
router.put('/', withAuth, (req,res) => {
  
  //-- Updates logged in user data based on what's provided in body
  try {
    User.update(
      {
        profile_resource_id:  req.body.profile_resource_id,
        name:                 req.body.name,
        username:             req.body.username,
        // email:                req.body.email, //-- TODO:: 02/26/2022 #EP || Ability to check if email exists first before changing
        password:             req.body.password,
        modified_date:        Date.now(),
      },
      {
        where: { id:          req.session.user_id  }
      })
      .then(userData => { 
        
        //--  if nothing to upate, EXIT
        if (!userData[0]) { res.status(400).json('User not found'); return; }
        
        //--Respond success exit
        res.status(204).end();
      })
      .catch(err => {
          res.status(500).json({ error: err['errors'][0].message });
      });
  }
  catch (err) { 
    res.status(500).json({ error: err['errors'][0].message });
  }
});

// Used to create secure login session IF Username exist and password match 
router.post('/login', async (req, res) => {
  
  try {
    //-- look for user with matching email
    const dbUserData = await User.findOne({ where: { email: req.body.email, }, });
    //-- Unable to find email in database, EXIT.
    if (!dbUserData) { res.status(400).json({ message: 'Incorrect email or password.' }); return; }

    //-- Email in database, check for password match.
    const validPassword = await dbUserData.checkPassword(req.body.password)      
    //-- Password does not match userData associted to email. Exit.
    if ( !validPassword ) {res.status(400).json({ message: 'Incorrect email or password.' });return;}


    //-- Email Exists and Password Matches user email, create session and store user var in session cookies
    if (dbUserData && validPassword ) {  

      //-- Update User Login Date and Login Status
      try {
        User.update( 
          { login_date: Date.now(), login_state: true },
          { where: { id:       dbUserData.id  }}
      )}
      //-- Unable to update login_state and login_date
      catch (err) {
        res.status(500).json({ error: err['errors'][0].message });
      }

      //-- Store session variables
      req.session.save(() => { 
        req.session.login_date = Date.now();
        req.session.username = dbUserData.username;
        req.session.user_id = dbUserData.id;
        req.session.loggedIn = true;

        //-- respond with success
        res.status(204).end();
      })
    }
  } 
  catch (err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});

// Logout
router.post('/logout', withAuth, async (req, res) => {
    
  //-- Update User Login-Status to false
  try {
    User.update( 
      { logout_date: Date.now(), login_state: false },
      { where: { id:       req.session.user_id  }}
  )}
  //-- Unable to update login_state and login_date
  catch (err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
  
  req.session.destroy(() => {
    res.status(204).end()
  });
});

// CREATE new user
router.post('/signup', async (req, res) => {
  
  console.log("attempting to creat new user")

  console.table(req.body)
  try {
    const dbUserData = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      created_date: (Date.now()),
      modified_date: (Date.now()),
      login_date: (Date.now()),
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      res
        .status(204).end();
    });
  } 
  catch (err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});


// DELETE existing user
router.delete('/',withAuth, async (req, res) => {
  try {
    
    //-- Check if email in Database
    const dbUserData = await User.findOne({ where: {  email: req.body.email  }});
    
    //-- If not in database, exists
    if (!dbUserData) {
      res.status(400).json( 'Incorrect email or password. Please try again!' );
      return;
    }
    
    //-- Run delete request based on email address and user logged in
    if (dbUserData){
      const deleteUserResults = await User.destroy({
        where: {   
          email:    req.body.email,
          id:       req.session.user_id  
        }
      });
      //-- respond
      res.status(204).end()
    }
  }
  catch(err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});

module.exports = router;
