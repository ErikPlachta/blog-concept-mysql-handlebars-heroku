//------------------------------------------------------------------------------
const router = require('express').Router();
const { User, Resource, Post, Comment } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');


//------------------------------------------------------------------------------
//-- ROUTES

// //-- GET all POSTS for homepage
router.get('/', async (req, res) => {
  try {
    
    // GET POSTS
    const postData = await Post.findAll({ 
      // limit: 10,
      order: [
        ['created_date', 'DESC']
      ],
      include: [
        {
          model: User,
          attributes: ['id','username','created_date'],
        },
        {
          model: Resource,
          attributes: ['title','url'],
        }
      ],
    });

    // Build it to prepare for html
    const posts = postData.map((post) =>
      post.get({ plain: true })
    );

    const commentData = await Comment.findAll({ 
      // limit: 10,
      order: [
        ['created_date', 'DESC']
      ],
      // include: [
      //   {
      //     model: User,
      //     attributes: ['id','username','created_date'],
      //   },
      //   {
      //     model: Resource,
      //     attributes: ['title','url'],
      //   }
      // ],
    });

    //TODO:: 02/10/2022 #EP | Build for Posts
    const comments = commentData.map((post) =>
      post.get({ plain: true })
    );
    
    res.render('homepage', {
      comments,
      posts,
      loggedIn: req.session.loggedIn,
      // username: req.sessionID.username
    });
  } 
  
  catch (err) {  
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


router.get('/post/:id', withAuth, async (req, res) => {
  
  try {

    //-- Get the specific post

    const dbPostData = await Post.findByPk( req.params.id, {
      include: [
        { model: User, attributes: ['id','username','created_date'],},
        { model: Resource, attributes: ['post_id','title','url'], }
      ],
    });
    const post = dbPostData.get({ plain: true });
    
    
    //-- get comments related
    const dbCommentData = await Comment.findAll({
      where: {
        post_id: req.params.id,
      },
      include: [
        {
          model: Post,
          attributes: ['id'],
        },
        // {
        //   model: Resource,
        //   attributes: ['post_id','title','url'],
        // }
      ],
    });

    const comments = dbCommentData.map((post) => post.get({ plain: true }) );




    res.render('post', { 
      post,
      loggedIn: req.session.loggedIn 
    });
  } 
  catch (err) {
    res
      .status(500)
      .json({
        response: {
          status: 500,
          error: String(err)
        }
      })
  }
});


module.exports = router;
