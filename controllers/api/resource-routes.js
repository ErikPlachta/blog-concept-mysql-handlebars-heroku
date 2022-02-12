const router = require('express').Router();
const { Resource } = require('../../models');



// Get Resoruces from DB IF logged in
router.get('/', async (req, res) => {
  
  try {
    if (req.session.loggedIn) {
      res
        .status(200)
        .json(
          {
            message: 'Connection to ./api/resoruces/ successful. NOTE: Authentication and script to be setup.' 
          }
        );
    } else {
      res
        .status(500)
        .json({ message: 'Authentication error.' });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
