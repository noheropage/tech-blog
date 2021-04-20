const { User } = require("../models");

const userData = [
  {
    username: "Julien Hobbs",
    password: "password1",
    // id: 1,
  },
  {
    username: "Casey Proctor",
    password: "password2",
    // "id": 2
  },
  {
    username: "Janet Walters",
    password: "password3",
  },
  {
    username: "Skylar Hawkins",
    password: "password4",
  },
  {
    username: "Dylan Koch",
    password: "password5",
  },
  {
    username: "Lilliana Quinn",
    password: "password6",
  },
  {
    username: "Josue Nolan",
    password: "password7",
  },
  {
    username: "Juliet Ray",
    password: "password8",
  },
  {
    username: "Jacob Blackwell",
    password: "password9",
  },
];

const seedUsers = () => User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
      });
  

module.exports = seedUsers;
