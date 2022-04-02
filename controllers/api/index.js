//------------------------------------------------------------------------------
//-- Imports
const router = require('express').Router();

const userRoutes = require('./user-routes');
const resourceRoutes = require('./resource-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');
//------------------------------------------------------------------------------
//-- Routing

//-- Importing other routes to ensure existing express has access 
router.use('/users', userRoutes);
router.use('/user', userRoutes);

router.use('/resources', resourceRoutes);
router.use('/resource', resourceRoutes);

router.use('/posts', postRoutes);
router.use('/post', postRoutes);

router.use('/comments', commentRoutes);
router.use('/comment', commentRoutes);


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
  .end();
  
});


//------------------------------------------------------------------------------
//-- Exports
module.exports = router;