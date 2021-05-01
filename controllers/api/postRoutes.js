const router = require('express').Router();
const { Post, User, Comment } = require('../../models')
const withAuth = require('../../utils/auth')

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{ model: User, attributes: ['username'] }]
        })
        res.status(200).json(postData)
    } catch (error) {
        res.status(500).json(error)
    }
})

// add withAuth
router.post('/', async (req, res) => {
    try {
        const newPost = await Post.create(
            {
                // title: req.body.title,
                // content: req.body.content
            ...req.body,
            user_id: req.session.user_id
        }
        )

        res.status(200).json(newPost)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post('/comment', async (req, res) => {
    try {
        const newComment = await Comment.create(
            {
                ...req.body,
                user_id: req.session.user_id,
                // post_id: 
            }
        )
        res.status(200).json(newComment)
    } catch (error) {
        res.status(500).json(error)
    }
})

// add withAuth
router.put('/:id', async (req, res) => {
    try {
        const updatePost = await Post.update(
            {
                content: req.body.content,
                date_created: Date.now()
            },
            {
                where: {
                    user_id: req.session.user_id,
                    id: req.params.id
                }
            }
        )
        res.status(200).json(updatePost)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                { 
                    model: User, attributes: ['username'] 
                }, 
                { 
                    model: Comment 
                }
            ]
        })
        res.status(200).json(postData)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                post_id: req.params.id
            }
        })
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' })
            return;
        }
        res.status(200).json(commentData + postData)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;