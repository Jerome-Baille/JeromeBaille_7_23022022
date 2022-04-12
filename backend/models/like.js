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
      Like.belongsTo(models.Post, { foreignKey: 'postId'}, { onDelete: 'cascade', hooks: true })
      Like.belongsTo(models.User, { foreignKey: 'userId'}, { onDelete: 'cascade', hooks: true })
    }
  }
  Like.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    isLiked: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};