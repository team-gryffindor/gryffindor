const review = (sequelize, DataTypes) => {
  const Review = sequelize.define('review', {
    // id: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV1,
    //   primaryKey: true
    // },
    // incrementing INTEGER id for easy development
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rating: DataTypes.FLOAT,
    comment: DataTypes.TEXT
  });

  return Review;
};

module.exports = review;
