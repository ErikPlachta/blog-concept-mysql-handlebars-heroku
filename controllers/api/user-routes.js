const router = require('express').Router();
const { User } = require('../../models');



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

    req.session.save(() => {
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
router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      name: req.body.name,
      username: req.body.username,
      profile_resource_id: req.body.profile_resource_id,
      user: req.body.user,
      email: req.body.email,
      password: req.body.password,
      created_date: req.body. created_date,
      modified_date: req.body. modified_date,
      login_date: req.body. login_date
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
    res.status(500).json(err);
  }
});


// DELETE existing user
router.delete('/', async (req, res) => {
  try {

    if (req.session.loggedIn) {

      //-- Check if email in Database
      const dbUserData = await User.findOne({
        where: {
          email: req.body.email,
        },
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
        where: {
          email: req.body.email
          // password: req.body.password
          }
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
