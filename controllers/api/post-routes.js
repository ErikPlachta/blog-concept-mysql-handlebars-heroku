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


module.exports = router;
