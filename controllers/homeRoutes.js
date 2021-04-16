const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
  try {
    //   create call for all blog posts
    const postData = await Post.findAll({});

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      // Pass the logged in flag to the template
    //   logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
