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
    
  //-- get user data
  const dbUserData = await User.findAll({
    attributes: { exclude: ['password'] }, /* no passwords*/
     where: {id: 1}, /* TODO:: Get current user */
    });
  //-- building comments
  const users = dbUserData.map((user) => user.get({ plain: true }) );

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
          attributes: ['user_id','title','url'],
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
      username: req.sessionID.username
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

router.get('/profile', withAuth, async (req, res) => {
  
  //-- get user data
  const dbUserData = await User.findAll({
    attributes: { exclude: ['password'] }, /* no passwords*/
     where: {id: 1}, /* TODO:: Get current user */
    });
  //-- building comments
  const users = dbUserData.map((user) => user.get({ plain: true }) );

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
        attributes: ['user_id','title','url'],
      }
    ],
  });
  console.log(req.session.user_id)
  // Build it to prepare for html
  const posts = postData.map((post) => post.get({ plain: true }));

  
  //-- get comments related
  const dbCommentData = await Comment.findAll({
    where: {
      user_id: 1,
    },
    include: [
      { model: Post, attributes: ['id'], },
    ],
  });
  //-- building comments
  const comments = dbCommentData.map((post) => post.get({ plain: true }) );

  res.render('profile', {
    users,
    comments,
    posts,
    loggedIn: req.session.loggedIn 
  });
});

router.get('/post/:id', withAuth, async (req, res) => {
  
  try {    
    
    //-- get comments and all releated data
    const dbCommentData = await Comment.findAll({
      where: {
        post_id: req.params.id,
      },
      include: [
        {
          model: Post,
          attributes: ['id'],
        },
        {
          model: User,
          attributes: ['id','username','login_date'],
        }
      ],
    });
    const comments = dbCommentData.map((comment) => comment.get({ plain: true }) );

  //-- get the POST data
  const dbPostData= await Post.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: User,
        attributes: ['id','username','login_date'],
      }
    ],
    });
  //-- building comments
  const post = dbPostData.get({ plain: true });
    // console.log(post)
    //-- send data
    res.render('post', { 
      'post': post,
      'comments': comments,
      loggedIn: req.session.loggedIn 
    });
  } 
  catch (err) { res.render('404'); }
});

// Bad URL send home
router.get("/*", (req, res) => {
  res.render("404")
})


module.exports = router;
