const router = require('express').Router();
const { Post, User } = require('../../models');



// Get Resoruces from DB IF logged in
router.get('/', async (req, res) => {
  
  try {
    if (req.session.loggedIn) {
      
      const dbPosts = await Post.findAll({});
      
      res
        .status(200)
        .json(
          {
            loggedIn: req.session.loggedIn,
            message: 'Connection to ./api/posts/ successful.' ,
            results: dbPosts,
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
    res.status(500).json({
      error: String(err)
    });
  }
});


// CREATE new post
router.post('/', async (req, res) => {
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

   
    res
      .status(200)
      .json({
        
        results: postData
      });
    
  } 
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
