const router = require('express').Router();
const { Resource } = require('../../models');



// Get Resoruces from DB IF logged in
router.get('/', async (req, res) => {
  
  try {
    if (req.session.loggedIn) {
      const resourcesDB = await Resource.findAll();
      res
        .status(200)
        .json(
          {
            message: 'Connection to ./api/resoruces/ successful.',
            results: resourcesDB
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

// Get Resoruces from DB IF logged in
router.get('/:id', async (req, res) => {
  
  try {
    if (req.session.loggedIn) {
      const resourcesDB = await Resource.findOne({
        where: {
          id: req.params.id
        }
      });
      res
        .status(200)
        .json(
          {
            message: 'Connection to ./api/resoruces/ successful.',
            results: resourcesDB
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


// CREATE new Resource
router.post('/', async (req, res) => {
  try {
    if (req.session.loggedIn) {
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
  } 
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// DELETE existing Resource
router.delete('/:id', async (req, res) => {
  try {

    if (req.session.loggedIn) {

      const dbResourceData = await Resource.findOne({
        where: {
          id: req.params.id
        }
      })

      
      //-- If not in database, exists
      if (!dbResourceData) {
        res
          .status(400)
          .json({ message: 'Invalid Request. Please try again!' });
        return;
      }

      
      
      //-- Delete Resource
      const resourceDeletedResponse = await Resource.destroy({
        where: {
          id: req.params.id,
        },
      });
      
      //-- respond
      res
        .status(200)
        .json(
          {
            response: {
              status: 200,
              results: String(resourceDeletedResponse)
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
