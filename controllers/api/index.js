//------------------------------------------------------------------------------
//-- Imports
const router = require('express').Router();

//------------------------------------------------------------------------------
//-- Routing

//-- Importing other routes to ensure existing express has access 
const userRoutes = require('./user-routes');
router.use('/users', userRoutes);
router.use('/user', userRoutes);

const resourceRoutes = require('./resource-routes');
router.use('/resources', resourceRoutes);
router.use('/resource', resourceRoutes);

const postRoutes = require('./post-routes');
router.use('/posts', postRoutes);
router.use('/post', postRoutes);

const commentRoutes = require('./comment-routes');
router.use('/comments', commentRoutes);
router.use('/comment', commentRoutes);



// error page MM effort
router.get("/*", (req, res) => {
  res.redirect('/');
})


//-- if gets here when rounting, throw 404
router.use((req, res) => {
  // console.log(`//-- Calling a ${req.method} in controllers/api/index.js`);
  res.status(404).json({
    request: {
      method: req.method,
      params: req.params,
      // body: req.body,
      path: "./api",
    },
    response: {
      status: 404,
      message: "API rquest failure. Page not found."

    }
  })
  .render('homepage')
  
});

//------------------------------------------------------------------------------
//-- Exports
module.exports = router;