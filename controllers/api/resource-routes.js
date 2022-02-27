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
    res.status(500).json({ error: err['errors'][0].message });
  }
});

// Get Resoruces from DB IF logged in
router.get('/:id', withAuth, async (req, res) => {
  
  try {
    const resourcesDB = await Resource.findOne({ where: { id: req.params.id }});
    res.status(200).json( resourcesDB );
  }
  catch (err) {
    res.status(500).json({ error: err['errors'][0].message });
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
      res.status(204).end();
  } 
  catch (err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});


//-- Users able to update their own unique data.
router.put('/:id', withAuth, (req,res) => {
  
  //-- Updates logged in user data based on what's provided in body
  try {
    Resource.update(
      {
        user_id:              req.session.user_id, //-- Assigns to user logged in
        profile_resource_id:  req.body.profile_resource_id, //-- If created in profile
        post_id:              req.body.post_id, //-- If created in comment/post
        title:                req.body.title, //-- what it's named
        url:                  req.body.url, //-- where it's located
        type:                 req.body.type, //-- String value to define type
        modified_date:        Date.now(),
      },
      {
        where: {
          id:          req.params.id,
          user_id:     req.session.user_id
        }
      })
      .then(resourceData => { 
        
        //--  if nothing to upate, EXIT
        if (!resourceData[0]) { res.status(400).json('Resource not found'); return; }
        
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


// DELETE existing Resource
router.delete('/:id', withAuth, async (req, res) => {
  try {
    
    //-- Verify if resource exists and belogns to logged in user
    const dbResourceData = await Resource.findOne({
      where: {
        id:       req.params.id,
        user_id:  req.session.user_id
      }
    })

    //-- If not in database or owned by user logged in, EXIT
    if (!dbResourceData) { res.status(400).json('Resource does not exist or is owned by another user.'); return; }

    //-- If In Database AND owned by user logged in, delete it, EXIT
    if (dbResourceData) {
      const resourceDeletedResponse = await Resource.destroy({ where: { id: req.params.id }, });
      res.status(204).end();
      return;
    }
  }
  catch(err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});

//-- Exports updates back out ./index.js
module.exports = router;
