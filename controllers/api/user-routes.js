const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth.js')


//-- Get non-sensitive user dat

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

router.put('/', withAuth, (req,res) => {
  try{
    User.update(
      {
        profile_resource_id:  req.pararms.profile_resource_id,
        name:                 req.pararms.name,
        username:             req.pararms.username,
        email:                req.pararms.email,
        password:             req.pararms.password,
        modified_date:        Date.now(),
        login_date:           Date.now(),
      },
      {
        where: { id:          req.session.user_id  }
      })
        .then(userData => {
          if (!userData[0]) {
            res.status(400).json({message: 'User not found!'}); return;
          }
          res.json(`Update Request Processed: ${userData}`);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);}
        );

  }
  catch (err) {
    res.json(err)
  }

});


// Run LOGIN script
router.post('/login', async (req, res) => {
  
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // console.log(`/-- Attempting login for ${req.body.email} `);
    //-- username doesn't exist
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    //-- username exists but bad password
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    //-- stores session data that can be accessed by brower locally and securely
    req.session.save(() => {
      req.session.login_date = Date.now();
      req.session.username = dbUserData.username;
      req.session.user_id = dbUserData.id;
      req.session.loggedIn = true;

      res
      .status(200)
      .json({ user: dbUserData, message: 'You are now logged in!' });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
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
