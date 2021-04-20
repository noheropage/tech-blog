const { Post } = require('../models');

const postData = [
    {
        "content": "I just am1",
        "user_id": 1,
        "title": "How do you know if you're awesome?",
        "id": 1
    },
    {
        "content": "Well well well, what do we have here?2",
        "user_id": 2,
        "title": "Where do you draw the line?",
        "id": 2
    },
    {
        "content": "Moderna fo life3",
        "user_id": 1,
        "title": "Vaccines and me",
        "id": 3
    },
]

const seedPosts = () => Post.bulkCreate(postData, {
    returning: true,
});

module.exports = seedPosts;