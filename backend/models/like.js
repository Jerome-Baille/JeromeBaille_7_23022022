'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.belongsToMany(models.Post, {
        through: models.Like,
        foreignkey: 'userId',
        otherKey: 'postId',
      });

      models.Post.belongsToMany(models.User, {
        through: models.Like,
        foreignkey: 'postId',
        otherKey: 'userId',
      });      

      models.Like.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      models.Like.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post',
      });
    };
  }
  Like.init({
    // postId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'Post',
    //     key: 'id'
    //   }
    // },
    // userId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'User',
    //     key: 'id'
    //   }
    // }
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    like: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};