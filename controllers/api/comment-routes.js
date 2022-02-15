const router = require('express').Router();
const { Comment, Post } = require('../../models');



// Get Resoruces from DB IF logged in
router.get('/', async (req, res) => {
  
  try {
    if (req.session.loggedIn) {
      const commentsDB = await Comment.findAll();
      res
        .status(200)
        .json(
          {
            results: commentsDB,
            message: 'Connection to ./api/comments/ successful. NOTE: Authentication and script to be setup.' 
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
    res.status(500).json(err);
  }
});


// Get Resoruces from DB IF logged in by :id
router.get('/:id', async (req, res) => {
  
  try {
    if (req.session.loggedIn) {
      const commentDB = await Comment.findOne({
        where: {
          id: req.params.id,
        }
      });

      if(!commentDB){
        res
          .status(500)
          .json({
            message: `Comment ${req.params.id} does not exist. Please try again!`,
            results: commentDB
          });

        return;
      }

      res
        .status(200)
        .json(
          {
            message: 'Connection to ./api/comments/:id successful.',
            results: commentDB,
          }
        );
    }
    
    else {
      res
        .status(500)
        .json({ message: 'Authentication error.' });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// CREATE new Resource
router.post('/', async (req, res) => {
  try {
    if (req.session.loggedIn) {

      const postExists = await Comment.findOne({
        where: {
          id: req.body.post_id,
        }
      });
      
      
      if(!postExists) {
        res
          .status(500)
          .json({
            message: `Invalid request. Post id: ${req.body.post_id} does not exist.`,
            results: postExists
        });
        return;
      }

      const commentCreatedResponse = await Comment.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id,
        title: req.body.title,
        content: req.body.content,
        resource_id: req.body.resource_id,
        created_date: Date.now(),
        modified_date: Date.now()
      });

      
      
      res
        .status(200)
        .json({
          message: "Commented added to post.",
          results: commentCreatedResponse
      });
      return;
    }
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Catch failure",
      error: String(err)
    });
  }
});


// DELETE existing Resource
router.delete('/:id', async (req, res) => {
  try {

    if (req.session.loggedIn) {

      const commentDB = await Comment.findOne({
        where: {
          id: req.params.id
        }
      })

      
      //-- If not in database, exists
      if (!commentDB) {
        res
          .status(400)
          .json({ message: 'Invalid Request. Please try again!' });
        return;
      }

      
      
      //-- Delete Resource
      const commentDeletedResponse = await Comment.destroy({
        where: {
          id: req.params.id,
        },
      });
      
      //-- respond
      res
        .status(200)
        .json(
          {
            response: {
              status: 200,
              results: String(commentDeletedResponse)
            }
          }
        );
      return;
    }
    
    //-- If some sort of error other than catch error
    res
    .status(200)
    .json(
      {
        response: {
          status: 200,
          results: "Invalid request. See admin."
        }
      }
    );
    return;
  }
  catch(err) {
    // console.log(err);
    res
      .status(500)
      .json(
        {
          response: {
            error: String(err)
          }
        }
      );
  }
});

module.exports = router;
