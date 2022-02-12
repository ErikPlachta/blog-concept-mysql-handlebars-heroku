//------------------------------------------------------------------------------
//-- Imports
const router = require('express').Router();

//------------------------------------------------------------------------------
//-- Routing

//-- Importing other routes to ensure existing express has access 
const userRoutes = require('./user-routes');
router.use('/users', userRoutes);

const resourceRoutes = require('./resource-routes');
router.use('/resources', resourceRoutes);

const postRoutes = require('./post-routes');
router.use('/kbas', postRoutes);

const commentRoutes = require('./post-routes');
router.use('/kbas', commentRoutes);


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
  }).end();
  
});

//------------------------------------------------------------------------------
//-- Exports
module.exports = router;