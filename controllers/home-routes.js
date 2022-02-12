//------------------------------------------------------------------------------
const router = require('express').Router();
const { User, Resource, Post } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');


//------------------------------------------------------------------------------
//-- ROUTES

// //-- GET all KBAs for homepage
// //TODO:: 02/10/2022 #EP | Build for KBAs
router.get('/', async (req, res) => {
  try {
    //TODO:: 02/10/2022 #EP | Build for KBAs
    const postData = await User.findAll({ 
      include: [
        {
          // model: Post,
          attributes: ['title', 'description'],
        },
      ],
    });

    //TODO:: 02/10/2022 #EP | Build for Posts
    const posts = postData.map((kba) =>
      post.get({ plain: true })
    );

    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// // GET one category
// // Use the custom middleware before allowing the user to access the KBA
// //TODO:: 02/10/2022 #EP | Build for KBAs
// router.get('/gallery/:id', withAuth, async (req, res) => {
//   try {
//     //TODO:: 02/10/2022 #EP | Build for KBAs
//     const dbGalleryData = await Gallery.findByPk(req.params.id, {
//       include: [
//         {
//           //TODO:: 02/10/2022 #EP | Build for KBAs
//           model: Painting,
//           attributes: [
//             'id',
//             'title',
//             'artist',
//             'exhibition_date',
//             'filename',
//             'description',
//           ],
//         },
//       ],
//     });

//     //TODO:: 02/10/2022 #EP | Build for KBAs
//     const gallery = dbGalleryData.get({ plain: true });
//     res.render('gallery', { gallery, loggedIn: req.session.loggedIn });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

// // GET one KBA
// // Use the custom middleware before allowing the user to access the painting
// //TODO:: 02/10/2022 #EP | Build for KBAs
// router.get('/painting/:id', withAuth, async (req, res) => {
//   try {
//     const dbPaintingData = await Painting.findByPk(req.params.id);

//     const painting = dbPaintingData.get({ plain: true });

//     res.render('painting', { painting, loggedIn: req.session.loggedIn });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
