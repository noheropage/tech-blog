const { Comment } = require('../models');

const commentData = [
    {
        "content": "Could not agree more",
        "user_id": 1,
        "post_id": 1,
    },
    {
        "content": "Well well well, what do we have here?",
        "user_id": 1,
        "post_id": 2
    },
    {
        "content": "Well, actually....",
        "user_id": 2,
        "post_id": 2
    },
]

const seedComments = () => Comment.bulkCreate(commentData, {
    returning: true,
});

module.exports = seedComments;