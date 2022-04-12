'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ComLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ComLike.belongsTo(models.Comment, { foreignKey: 'commentId'}, { onDelete: 'cascade', hooks: true })
      ComLike.belongsTo(models.User, { foreignKey: 'userId'}, { onDelete: 'cascade', hooks: true })
    }
  }
  ComLike.init({
    commentId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    isLiked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ComLike',
  });
  return ComLike;
};