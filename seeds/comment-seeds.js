const { Comment } = require('../models');

const commentData = [
    {
        "content": "Very true1",
        "user_id": 1,
        "post_id": 1,
    },
    {
        "content": "Well well well, what do we have here?2",
        "user_id": 1,
        "post_id": 2
    },
    {
        "content": "How do you do?3",
        "user_id": 2,
        "post_id": 2
    },
]

const seedComments = () => Comment.bulkCreate(commentData, {
    returning: true,
});

module.exports = seedComments;