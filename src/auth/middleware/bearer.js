'use strict';

const { users } = require('../models/index.js');
// console.log({users});
module.exports = async (req, res, next) => {
  // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk");

  try {

    if (!req.headers.authorization) { next('Invalid Login') }
    // console.log({token});
    const token = req.headers.authorization.split(' ').pop();
    // console.log({token});
    const validUser = await users.authenticateToken(token).then(async(x)=>{
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>',{x});
      req.user = x;
      // req.token = x.token;
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>',req.user);
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>',req.token);
      next();
    })
    .catch((e)=>{
      res.status(403).send('Invalid Login');
    })
 



  } catch (e) {
    console.error(e);
    res.status(403).send('Invalid Login');
  }
}
