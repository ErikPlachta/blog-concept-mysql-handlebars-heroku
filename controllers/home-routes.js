//------------------------------------------------------------------------------
const router = require('express').Router();
const { User, Resource, Post, Comment } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');


//------------------------------------------------------------------------------
//-- ROUTES

// //-- GET all POSTS for homepage
router.get('/', async (req, res) => {
  console.log("homepage")
  try {
    
    // Get all Posts
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

    // Get all COmments
    const commentData = await Comment.findAll({ 
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
          model: Post,
          attributes: ['id','title'],
        }
      ],
    });

    //TODO:: 02/10/2022 #EP | Build for Posts
    const comments = commentData.map((post) =>
      post.get({ plain: true })
    );
    console.log(req.session)
    //-- if logged in, grab user data to build navbar with their info in it
    if(req.session.loggedIn){
      const dbUserData = await User.findOne({
        attributes: { exclude: ['password','name'] }, /* no passwords*/
        where: { id: req.session.user_id }, 
      });
      //-- building active-user data
      const activeUserData = dbUserData.get({ plain: true });
      //-- render homepage with user session data
      res.render('homepage', {
        activeUserData,
        comments,
        posts,
        loggedIn: req.session.loggedIn,
        username: req.session.username,
        id: req.session.user_id
      });
    }
    
    //-- if not logged in, just basic nav
    if(!req.session.loggedIn){
      res.render('homepage', {
        comments,
        posts
      });
    }
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
     where: {id: req.session.user_id}, /* TODO:: Get current user */
  });

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
        where: {id: req.session.user_id}, /* TODO:: Get current user */
      },
      {
        model: Resource,
        attributes: ['user_id','title','url'],
      }
    ],
  });
  // console.log(req.session)
  // Build it to prepare for html
  const posts = postData.map((post) => post.get({ plain: true }));

  
  //-- get comments related
  const dbCommentData = await Comment.findAll({
    where: {
      user_id: req.session.user_id,
    },
    include: [
      { model: Post, attributes: ['id'], },
    ],
  });
  //-- building comments
  const comments = dbCommentData.map((post) => post.get({ plain: true }) );

  // console.log(req.session)
  res.render('profile', {
    users,
    comments,
    posts,
    loggedIn: req.session.loggedIn,
    username: req.session.username,
    id: req.session.user_id
  });
});

router.get('/post/:id', withAuth, async (req, res) => {
  
  try {    
    
    //-- get comments and all related data
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
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      id: req.session.user_id
    });
  } 
  catch (err) { res.render('404'); }
});

// Bad URL send home
router.get("/*", (req, res) => {
  res.render("404")
})


module.exports = router;
