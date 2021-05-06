const router = require('express').Router();
const { User, Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Displays all users
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll()
        res.status(200).json(userData)
    } catch (error) {
        res.status(400).json(error)
    }
})

// Displays single user referencing it's id
router.get('/:id', async (req, res) => {
    try{
        const userData = await User.findByPk(req.params.id, {
             include: [{ model: Post }]
        })
        if(!userData) {
            res.status(404).json({ message: 'No location found with this id. '});
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Creates a new user
router.post('/', async (req, res) => {
    try{
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData)
        });
    } catch(err) {
        res.status(400).json(err);
    }
})

// This enables a user to login
router.post('/login', async (req, res) => {
    try{
        const userData = await User.findOne({ where: { username: req.body.username } });
        if(!userData) {
            res.status(400).json({message: 'Incorrect username or password, please try again'})
            return;
        }
        const validPassword = await userData.checkPassword(req.body.password);
        if(!validPassword) {
            res.status(400).json({message: 'Incorrect username or password, please try again'})
            return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.post_owner = false;
            req.session.logged_in = true;
            res.json({ user: userData, message: 'You are now logged in!'})
        })
    } catch(err) {
        res.status(400).json(err);
    }
})

// Logout
router.post('/logout', async (req, res) => {
    if(req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
})

module.exports = router;