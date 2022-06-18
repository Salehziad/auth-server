'use strict';

const {
  users
} = require('../../models-connections');

async function handleSignup(req, res, next) {
  // empty username/pssword 400
  // username already used 409
  try {
    const user = req.body
    if (Object.keys(user).length === 0) {}
    let x = user.username;
    console.log({
      x
    });
    if (x.length === 0) {
      res.status(403).send('no data entered')
    }
    var hashed = await users.beforeCreate(user);
    let userRecord = await users.create({
      username: req.body.username,
      password: hashed,
      role: req.body.role
    });
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(userRecord);
  } catch (e) {
    // console.error(e);
    next(e);
  }
}

async function handleSignin(req, res, next) {
  // console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuu',req.user);
  try {
    const user = {
      user: req.user,
      token: req.user.token
    };
    // console.log({user});
    res.status(200).json(user);
  } catch (e) {
    // console.error(e);
    next(e);
  }
}

async function handleGetUsers(req, res, next) {
  try {
    let come = req.user;
    // console.log("kkkkkkkkkkkkkkkkkkkk",come);
    // console.log({come});
    // const userRecords = await users.findAll({});
    // console.log({userRecords});
    // const list = userRecords.map(user => req.user);
    res.status(200).json(req.user);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

function handleSecret(req, res, next) {
  res.status(200).send("Welcome to the secret area!");
}

module.exports = {
  handleSignup,
  handleSignin,
  handleGetUsers,
  handleSecret
}