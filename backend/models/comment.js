'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Post, {foreignKey: 'postId'}, { onDelete: 'cascade', hooks: true }),
      Comment.belongsTo(models.User, {foreignKey: 'userId'}, { onDelete: 'cascade', hooks: true }),
      Comment.hasMany(models.ComLike)
    }
  }
  Comment.init({
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    isSignaled: DataTypes.BOOLEAN,
    points: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};