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
          exclude: ['type','password','email','modified_date','created_date','name']
          // exclude: ['type','password','email','modified_date','created_date','username','name']  
        },
      });
      
      res
      .status(200)
      .json({ users: dbUserData })
      .end();
      return null;
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
      .json({ users: dbUserData })
      .end();
      return null; 
    };
  }
  catch(err){
    res.status(500).json({ error: err['errors'][0].message });
  }
      
});

//-- Get non-sensitive user data by ID
router.get('/:id', async (req,res) => {

  try {
    // if NOT logged in, exclude details.
    if(!req.session.loggedIn){ 
      console.log("//-- not logged in")
      const dbUserData = await User.findOne({
        where: {    id: req.params.id   },
        attributes: { exclude: ['type','password','email','modified_date','created_date','username','name']  },
      });
      
      res.status(200).json({ users: dbUserData });
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


//-- Get user-type by id
router.get('/type/:id', async (req,res) => {

  try {
    // if NOT logged in, exit.
    if(!req.session.loggedIn){  res.status(401).end(); return; }

    //-- If logged-in, include more details
    if(req.session.loggedIn) {
      
      const dbUserData = await User.findOne({
        attributes: {
          exclude: ['type','password','email','modified_date','created_date','username','name']
        },
        where: {
          id: req.params.id,
        },
        
      });
      
      res.status(200).json({ users: dbUserData });
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
        res.status(202).end();
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
    //-- If logged in already, exit
    if(req.session.loggedIn){
      res.status(403).json({message: "Already logged in."}).end();
      return;
    }

    //-- If not yet logged in, try to login
    if(!req.session.loggedIn){
      
      //-- look for user with matching email
      const dbUserData = await User.findOne({ where: { email: req.body.email } });
      //-- Unable to find email in database, EXITs
      if (!dbUserData) { res.status(400).json({ message: 'Incorrect email or password.' }); return; }


      //-- Email in database, check for password match.
      const validPassword = await dbUserData.checkPassword(req.body.password)      
      //-- Password does not match userData associated to email. Exit.
      if ( !validPassword ) {res.status(400).json({ message: 'Incorrect email or password.' });return;}

      //-- Email Exists and Password Matches user email, create session and store user var in session cookies
      if (dbUserData && validPassword ) {  

        //-- Update User Login Date and Login Status
        try {
          User.update( 
            { login_date: Date.now(), login_state: true },
            { where: { id:       dbUserData.id  }}
        )}
        //-- Unable to update login_state and login_date. Exit
        catch (err) {
          res.status(500).json({ error: err['errors'][0].message}).end();
        }

        //-- Store session variables
        req.session.save(() => { 
          req.session.login_date = Date.now();
          req.session.username = dbUserData.username;
          req.session.user_id = dbUserData.id;
          req.session.user_type = dbUserData.type;
          req.session.loggedIn = true;

          //-- respond with success
          res.status(204).json({message: "Logout success."}).end();
        })
      }
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
    res.status(202).end()
  });
});

// CREATE new user
router.post('/signup', async (req, res) => {
  
  // console.log("attempting to creat new user")

  console.table(req.body)
  try {
    const dbUserData = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      type: 'user',
      created_date: (Date.now()),
      modified_date: (Date.now()),
      login_date: (Date.now()),
      type: 'user'
    });

    req.session.save(() => {
       //-- Store session variables and exit
      req.session.login_date = Date.now();
      req.session.username = dbUserData.username;
      req.session.user_id = dbUserData.id;
      req.session.user_type = dbUserData.type;
      req.session.loggedIn = true;
      res.status(202).end();
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
    
    //-- If user tried to login with account that doesn't exist, EXIT
    if (!dbUserData) { res.status(401).end(); return; }
    
    //-- Run delete request based on email address and user logged in
    if (dbUserData){

      console.log(`req.session.user_type: ${req.session.user_type}`)
      console.log(`req.session.user_id: ${req.session.user_id}`)
      console.log("is admin: ", req.session.user_type != "admin")
      console.log(`dbUserData.id: ${dbUserData.id}`)
      console.log("is current user", req.session.user_id != dbUserData.id)


      

      // if(req.session.user_type != 'admin' ) { res.status(401).end(); return; }

      //-- If NOT type admin or NOT current logged in user, EXIT. ( only admin can delete other users )
      if( (req.session.user_type != "admin") ){
        if(req.session.user_id != dbUserData.id){ res.status(403).end(); return; }
      };
      
      console.log(`req.session.type: ${req.session.type}`)
      console.log(`req.session.id: ${req.session.id}`)
      console.log(`dbUserData.UserData.id: ${dbUserData.id}`)

      //-- Otherwise, continue deleting
      const deleteUserResults = await User.destroy({
        where: {   
          id:       req.session.user_id
        }
      });
      console.log(deleteUserResults)
      //-- If deleted
      if(deleteUserResults){ res.status(202).end() }
      //-- If did not delete
      if(!deleteUserResults){ res.status(403).json( { "message" : "Can only delete your own user account." }).end() };
      
    }
  }
  catch(err) {
    try{
      res.status(500).json({ error: err['errors'][0].message });
    }
    catch {
      res.status(500).json( err );
    }
  }
});

module.exports = router;
