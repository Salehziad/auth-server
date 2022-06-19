'use strict';

const express = require('express');
const authRouter = express.Router();

const basicAuth = require('../middleware/basic.js');
const bearerAuth = require('../middleware/bearer.js');
// console.log(basicAuth);
const {
  handleSignin,
  handleSignup,
  handleGetUsers,
  handleSecret
} = require('./handlers.js');

authRouter.post('/signup', handleSignup);
authRouter.post('/signin', basicAuth, handleSignin);
authRouter.get('/users', bearerAuth, handleGetUsers);
authRouter.get('/secret', bearerAuth, handleSecret);
const acl=require('../middleware/aci-actions');



authRouter.get('/img', bearerAuth, acl('read'), (req, res) => {
  res.send('you can read this image');
});
authRouter.post('/img', bearerAuth, acl('create'), (req, res) => {
  res.send('new image was created');
});
authRouter.put('/img', bearerAuth, acl('update'), (req, res) => {
  res.send('image updated');
});
authRouter.delete('/img', bearerAuth, acl('delete'), (req, res) => {
  res.send('image deleted');
});






module.exports = authRouter;
