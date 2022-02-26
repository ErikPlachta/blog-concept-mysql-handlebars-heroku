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
    res.json(err)
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
        email:                req.body.email,
        password:             req.body.password,
        modified_date:        Date.now(),
      },
      {
        where: { id:          req.session.user_id  }
      })
      .then(userData => { //-- If nothing was updated
        if (!userData[0]) {
          res.status(400).json({message: 'User not found!'}); 
          return; 
        }
        res.json(`Update Request Processed: ${userData}`);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);}
        );
  }
  catch (err) { res.json(err) }
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
          { login_date: Date.now(), login_status: true },
          { where: { id:       dbUserData.id  }}
      )}
      //-- Unable to update login_status and login_date
      catch (err) {
        res.status(500).json(err)
      }

      //-- Store session variables
      req.session.save(() => { 
        req.session.login_date = Date.now();
        req.session.username = dbUserData.username;
        req.session.user_id = dbUserData.id;
        req.session.loggedIn = true;

        //-- respond with success
        res.status(200).json({ message: 'Login success.' })
      })
    }
  } 
  catch (err) {res.status(500).json(err);}
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    
    //-- Update User Login-Status to false
    try {
      User.update( 
        { logout_date = Date.now(), login_status: false },
        { where: { id:       dbUserData.id  }}
    )}
    //-- Unable to update login_status and login_date
    catch (err) {
      res.status(500).json(err)
    }
    
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
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
        .status(200)
        .json(dbUserData);
    });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    }
    );
  }
});


// DELETE existing user
router.delete('/',withAuth, async (req, res) => {
  try {

    if (req.session.loggedIn) {

      //-- Check if email in Database
      const dbUserData = await User.findOne({
        where: {  email: req.body.email  }
      });
      
      //-- If not in database, exists
      if (!dbUserData) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password. Please try again!' });
        return;
      }

      //-- Run delete request based on email address
      
      //TODO:: 02/15/2022 #EP || ADD if current user logged in
      const deleteUserResults = await User.destroy({
        where: {   email: req.body.email  }
      });
      
      //-- respond
      res
        .status(200)
        .json(
          {
            response: {
              status: 200,
              results: String(deleteUserResults)
            }
          }
        );
      return;
    }
    
    //-- If some sort of error other than catch error
    res
    .status(200)
    .json(
      {
        response: {
          status: 200,
          results: "Invalid request. See admin."
        }
      }
    );
    return;
  }
  catch(err) {
    // console.log(err);
    res
      .status(500)
      .json(
        {
          response: {
            error: String(err)
          }
        }
      );
  }
});


module.exports = router;
