const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth.js')


// Get Resoruces from DB IF logged in
router.get('/', withAuth, async (req, res) => {
  
  try {  
    const dbPosts = await Post.findAll({});
    res.status(200).json(dbPosts);
  }
  catch (err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});


// CREATE new post
router.post('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.create({
      user_id: req.session.user_id,
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
      status: req.body.status,
      category: req.body.category,
      topics: req.body.topics,
      resource_id: req.body.resource_id,
      created_date: Date.now(),
      modified_date: Date.now()
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
    Post.update(
      {
        title:          req.body.title,
        content:        req.body.content,
        type:           req.body.type,
        status:         req.body.status,
        category:       req.body.category,
        topics:         req.body.topics,
        resource_id:    req.body.resource_id,
        modified_date:  Date.now(),
      },
      {
        where: {
          id:           req.params.id,
          user_id:      req.session.user_id
         }
      })
      .then(postData => { 
        
        //--  if nothing to upate, EXIT
        if (!postData[0]) { res.status(400).json("Post not found"); return; }
        
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


// DELETE existing Post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    
    //-- Verify if resource exists and belogns to logged in user
    const dbPostData = await Post.findOne({
      where: {
        id:       req.params.id,
        user_id:  req.session.user_id
      }
    })

    //-- If not in database or owned by user logged in, EXIT
    if (!dbPostData) { res.status(400).json('Resource does not exist or is owned by another user.'); return; }

    //-- If In Database AND owned by user logged in, delete it, EXIT
    if (dbPostData) {
      const PostDeletedResponse = await Post.destroy({ where: { id: req.params.id }, });
      res.status(204).end();
    }
  }
  catch(err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});

module.exports = router;
