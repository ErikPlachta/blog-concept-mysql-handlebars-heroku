const router = require('express').Router();
const { Resource } = require('../../models');
const withAuth = require('../../utils/auth.js')

// Get Resoruces from DB IF logged in
router.get('/', withAuth, async (req, res) => {
  
  try {
    const resourcesDB = await Resource.findAll();
    res.status(200).json(resourcesDB);
  } 
  catch (err) {
    res.status(500).json(err);
  }
});

// Get Resoruces from DB IF logged in
router.get('/:id', withAuth, async (req, res) => {
  
  try {
    const resourcesDB = await Resource.findOne({ where: { id: req.params.id }});
    res.status(200).json({ results: resourcesDB});
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// CREATE new External Resource via a URL if Logged In
router.post('/', withAuth, async (req, res) => {
  try {    
      const dbUserData = await Resource.create({
            user_id:              req.session.user_id, //-- Assigns to user logged in
            profile_resource_id:  req.body.profile_resource_id, //-- If created in profile
            post_id:              req.body.post_id, //-- If created in comment/post
            title:                req.body.title, //-- what it's named
            url:                  req.body.url, //-- where it's located
            type:                 req.body.type, //-- String value to define type
            created_date:         Date.now(), 
            modified_date:        Date.now()
      });
      res.status(200).json(dbUserData);
  } 
  catch (err) {
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
