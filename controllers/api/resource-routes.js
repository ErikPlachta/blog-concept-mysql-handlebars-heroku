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


// CREATE new resource
router.post('/', async (req, res) => {
  try {
    const dbUserData = await Resource.create({
      id: req.body.id,
      user_id: req.body.user_id,
      profile_resource_id: req.body.profile_resource_id,
      post_id: req.body.post_id,
      title: req.body.title,
      url: req.body.url,
      type: req.body.type,
      created_date: Date.now(),
      modified_date: Date.now()
    });

    
    res
      .status(200)
      .json({
        results: dbUserData
      });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
