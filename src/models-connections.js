'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userSchema = require('./auth/models/users/users');
const clothesModel = require('./api.v1/models/clothes/model');
const foodModel = require('./api.v1/models/food/model');
const Collection = require('./api.v1/models/data-collection');
const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;

const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};
const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
const food = foodModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);


module.exports = {
  db: sequelize,
  users: userSchema(sequelize, DataTypes),
  food: new Collection(food),
  clothes: new Collection(clothes),
};
