//------------------------------------------------------------------------------
const router = require('express').Router();
const { User, Resource, Post, Comment } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');


//------------------------------------------------------------------------------
//-- ROUTES

// //-- GET all KBAs for homepage
// //TODO:: 02/10/2022 #EP | Build for KBAs
router.get('/', async (req, res) => {
  try {
    //TODO:: 02/10/2022 #EP | Build for KBAs
    const postData = await Post.findAll({ 
      include: [
        {
          model: User,
          attributes: ['id','username','created_date'],
        },
      ],
    });

    //TODO:: 02/10/2022 #EP | Build for Posts
    const posts = postData.map((post) =>
      post.get({ plain: true })
    );

    
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    
    res
      .status(500)
      .json({
        response: {
          status: 500,
          error: String(err)
        }
      });
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
