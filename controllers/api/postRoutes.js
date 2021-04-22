const router = require('express').Router();
const { Post, User, Comment } = require('../../models')
const withAuth = require('../../utils/auth')

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{ model: User }]
        })
        res.status(200).json(postData)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [{ model: User }, { model: Comment }]
        })
        res.status(200).json(postData)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;