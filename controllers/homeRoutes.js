const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
  try {
    //   create call for all blog posts
    const postData = await Post.findAll({
      include: [
        { 
          model: User, attributes: ["username"] 
        }
      ]
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      // Pass the logged in flag to the template
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// add withAuth
router.get('/profile', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    })

    const user = userData.get({ plain: true })

    res.render('profile', {
      ...user,
      logged_in: true
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/login', (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User, attributes: ['username']
        },
      ]
    })
    const commentData = await Comment.findAll({
      where: {
        post_id: req.params.id
      },
      include: [
        {
          model: User, attributes: ['username']
        }
      ]
    })
    if (postData.user_id === req.session.user_id) {
      req.session.post_owner = true;
    } else {
      req.session.post_owner = false;
    }
    const post = postData.get({ plain: true })
    const comments = commentData.map((comment) => comment.get({ plain: true }))

    res.render('post', {
      ...post,
      comments,
      logged_in: req.session.logged_in,
      post_owner: req.session.post_owner
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router;
