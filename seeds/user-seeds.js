const { User } = require("../models");

const userData = [
  {
    username: "Julien Hobbs",
    password: "password1",
  },
  {
    username: "Casey Proctor",
    password: "password2",
  },
  {
    username: "Janet Walters",
    password: "password3",
  },
];

const seedUsers = () => User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
      });
  

module.exports = seedUsers;
