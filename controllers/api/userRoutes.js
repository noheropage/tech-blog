const router = require('express').Router();
const { User } = require('../../models');
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
            req.session.group_id = userData.group_id;
            req.session.logged_in = true;
            res.json({ user: userData, message: 'You are now logged in!'})
        })
    } catch(err) {
        res.status(400).json(err);
    }
})

// This enables a user to join a group
// router.put('/:id', withAuth, async (req, res) => {
//     try{
//         const newPassword = await User.update(
//             {password: req.body.password},
//             {
//                 where: {
//                     id: req.params.id,
//                 }
//             }
//         )
//         res.status(200).json(newPassword)
//     } catch(err) {
//         res.status(400).json(err)
//     }
// })

router.put('/joinGroup', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id)
        if (!userData) {
            res.status(404).json({ message: 'No user found with this ID' })
            return;
        }
        userData.group_id = req.body.group_id;
        userData.save()
        req.session.group_id = userData.group_id
        res.status(200).json(userData)
    } catch (error) {
        res.status(400).json(error)
    }
})

// This creates an event and sends an email to those concerned
router.post('/addEvent', withAuth, async (req, res) => {
    try {
        try {
            const addEvent = await UserEvent.create({
                user_id: req.session.user_id,
                event_id: req.body.event_id
            })
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
            }
            else {
                res.status(500).json(error)
            }
        }
        const currentUser = await User.findByPk(req.session.user_id)
        const userData = await User.findAll({ where: { group_id: currentUser.group_id }, attributes: ['email']})
        const currentEvent = await Event.findByPk(req.body.event_id)
        userData.forEach(element => {
            nodeMail.sendEventEmail(element.email, currentUser, currentEvent);
        });
        res.status(200).json(userData)
    } catch (error) {
        res.status(500).json(error)        
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

// Enables users to leave a group that they are a member of
router.put('/leaveGroup', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id)
        userData.group_id = null;
        userData.save()
        req.session.group_id=userData.group_id;
        res.status(200).json(userData)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;