'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('u1', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({
          username: this.username
        }, process.env.SECRET);
      }
    }
  });

  model.beforeCreate= async function(password){
    // console.log('?>?????????????????????????????????????????????????????????????',user);
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>model",user);
    let hashedPass =await bcrypt.hash(password, 10);
    // console.log('<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><',hashedPass);
    // let newPassword = hashedPass;
    // console.log('<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><',newPassword);
    return hashedPass;
  };

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',username,password);
    const user = await this.findOne({
      where :{username:username}
    });
    // console.log({user});
    // let x=user.password
    // console.log({password});
    const valid = await bcrypt.compare(password, user.password);
    // console.log({valid});
    if (valid) {
      return user;
    }
    throw new Error('Invalid User');
  }

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET);
      // console.log({parsedToken});
      const user = this.findOne({where:{username: parsedToken.username}});
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',{user});
      if (user) {
        return user;
      }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message)
    }
  }

  return model;
}

module.exports = userSchema;