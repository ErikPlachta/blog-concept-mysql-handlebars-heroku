const router = require('express').Router();
const { Comment, Post, User } = require('../../models');
const withAuth = require('../../utils/auth.js')


// Get Comment from DB IF logged in
router.get('/', async (req, res) => {
  try {

      if(withAuth){
        const commentsDB = await Comment.findAll({
          include: [
            {
                model: User,
                attributes: ['id','username']
            },
          ],
        });
        res.status(200).json( commentsDB );
      }
      if(!withAuth){
        const commentsDB = await Comment.findAll({
          // attributes: {
            // exclude: ['password','email','modified_date','created_date','username','name']
          },
        );
        res.status(200).json( commentsDB );        
      }
  }
  catch (err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});

// Get Comment from DB IF logged in by :id
router.get('/:id', withAuth, async (req, res) => {
  
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

// Create new Comment
router.post('/', withAuth, async (req, res) => {
  try {
      const commentCreatedResponse = await Comment.create(
        {
          user_id: req.body.user_id,
          post_id: req.body.post_id,
          title: req.body.title,
          content: req.body.content,
          resource_id: req.body.resource_id,
          modified_date: Date.now(),
          created_date: Date.now()
        }
      );
      res.status(204).end()
  } 
  catch (err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});

//-- Users able to update their own unique data.
router.put('/:id', withAuth, (req,res) => {
  
  //-- Updates logged in user data based on what's provided in body
  try {
    Comment.update(
      {
        title: req.body.title,
        content: req.body.content,
        resource_id: req.body.resource_id,
        modified_date: Date.now(),
      },
      {
        where: {
          id:          req.params.id,
          user_id:     req.session.user_id
        }
      })
      .then(commentData => { 
        //--  if nothing to upate, EXIT
        if (!commentData[0]) { res.status(400).json('Resource not found'); return; }
        
        //--Respond success exit
        res.status(204).end();
      })
      .catch(err => {
          res.status(500).json({ error: err['errors'][0].message });
      });
  }
  catch (err) { 
    res.status(500).json({ error: err['errors'][0].message });
  }
});


// DELETE existing comment if user owns it
router.delete('/:id', async (req, res) => {
  try {
    
    //-- Look for the Comment by ID
    const commentDB = await Comment.findOne({ where: { id: req.params.id }})
    //-- If not in database, EXIT
    if (!commentDB) { res.status(400).json({ message: 'Invalid Request.' }); return; }
    //-- If comment exists but not User's, EXIT
    if(!commentDB.user_id == req.session.user_id){   res.status(400).json({ message: 'Invalid Request.' }); return; }
      
    //-- if comment exists and the logged in user owns it, delete it
    if(commentDB && (commentDB.user_id == req.session.user_id) ) {
      const commentDeletedResponse = await Comment.destroy({
        where: {
          id:       req.params.id,
          user_id:  req.session.user_id
        },
      });
      res.status(204).end();
    }
  }
  catch(err) {
    res.status(500).json({ error: err['errors'][0].message });
  }
});

module.exports = router;
