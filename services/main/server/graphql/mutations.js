const graphql = require('graphql');
const Models = require('../db/index.js');
const Sequelize = require('sequelize');

const {
  UserType,
  LessonType,
  ReviewType,
  FavoriteLessonType,
  SignupLessonType
} = require('./types.js');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt
} = graphql;

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        uid: { type: GraphQLID },
        name: { type: GraphQLString },
        image: { type: GraphQLString },
        description: { type: GraphQLString },
        locationOfResidence: { type: GraphQLString },
        cityOfResidence: { type: GraphQLString },
        stateOfResidence: { type: GraphQLString },
        lat: { type: GraphQLFloat },
        lng: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        // sequelize to add user
        return Models.User.build({
          uid: args.uid,
          name: args.name,
          image: args.image,
          description: args.description,
          locationOfResidence: args.locationOfResidence,
          lat: args.lat,
          lng: args.lng,
          cityOfResidence: args.cityOfResidence,
          stateOfResidence: args.stateOfResidence
        })
          .save()
          .then((data) => data)
          .catch((err) => console.error(err));
      }
    },
    addLesson: {
      type: LessonType,
      args: {
        title: { type: GraphQLString },
        image: { type: GraphQLString },
        description: { type: GraphQLString },
        locationOfService: { type: GraphQLString },
        cityOfService: { type: GraphQLString },
        stateOfService: { type: GraphQLString },
        lat: { type: GraphQLFloat },
        lng: { type: GraphQLFloat },
        category: { type: GraphQLString },
        difficulty: { type: GraphQLString },
        userId: { type: GraphQLID },
        price: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        // sequelize to add user
        return Models.Lesson.build({
          title: args.title,
          description: args.description,
          category: args.category,
          locationOfService: args.locationOfService,
          cityOfService: args.cityOfService,
          stateOfService: args.stateOfService,
          lat: args.lat,
          lng: args.lng,
          difficulty: args.difficulty,
          image: args.image,
          userId: args.userId,
          price: args.price
        })
          .save()
          .then((data) => {
            return data;
          })
          .catch((err) => console.error(err));
      }
    },
    addReview: {
      type: ReviewType,
      args: {
        title: { type: GraphQLString },
        comment: { type: GraphQLString },
        rating: { type: GraphQLInt },
        lessonId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      resolve(parent, args) {
        // sequelize to add user
        return Models.Review.build({
          title: args.title,
          comment: args.comment,
          rating: args.rating,
          lessonId: args.lessonId,
          userId: args.userId
        })
          .save()
          .then((data) => {
            return Promise.all([Models.Lesson.findById(data.dataValues.lessonId), data]);
          })
          .then((data) => {
            let lesson = data[0];
            let rating = data[1];
            lesson.updateAttributes({
              numOfReviews: lesson.dataValues.numOfReviews + 1,
              avgRating: updateRating(
                lesson.dataValues.numOfReviews,
                lesson.dataValues.avgRating,
                rating.dataValues.rating
              )
            });
            return rating;
          })
          .catch((err) => console.error(err));
      }
    },
    addFavoriteLesson: {
      type: FavoriteLessonType,
      args: {
        userId: { type: GraphQLID },
        lessonId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Models.Favorite.build({
          userId: args.userId,
          lessonId: args.lessonId
        })
          .save()
          .then((data) => data)
          .catch((err) => console.error(err));
      }
    },
    deleteFavoriteLesson: {
      type: FavoriteLessonType,
      args: {
        userId: { type: GraphQLID },
        lessonId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Models.Favorite.destroy({
          where: {
            userId: args.userId,
            lessonId: args.lessonId
          }
        })
          .then((data) => {
            console.log(data);
            return data;
          })
          .catch((err) => console.error(err));
      }
    },
    addSignupLesson: {
      type: SignupLessonType,
      args: {
        userId: { type: GraphQLID },
        lessonId: { type: GraphQLID },
        date: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Models.Signup.build({
          userId: args.userId,
          lessonId: args.lessonId,
          date: args.date
        })
          .save()
          .then((data) => data)
          .catch((err) => console.error(err));
      }
    },
    deleteSignupLesson: {
      type: SignupLessonType,
      args: {
        userId: { type: GraphQLID },
        lessonId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Models.Signup.destroy({
          where: {
            userId: args.userId,
            lessonId: args.lessonId
          }
        })
          .then((data) => data)
          .catch((err) => console.error(err));
      }
    },
    deleteLesson: {
      type: LessonType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Models.Lesson.update({ isActive: false }, { where: { id: args.id } })
          .then((data) => {
            console.log('updated lesson', data);
            return data;
          })
          .catch((err) => console.error(err));
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        uid: { type: GraphQLID },
        name: { type: GraphQLString },
        image: { type: GraphQLString },
        description: { type: GraphQLString },
        locationOfResidence: { type: GraphQLString },
        cityOfResidence: { type: GraphQLString },
        stateOfResidence: { type: GraphQLString },
        lat: { type: GraphQLFloat },
        lng: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        // sequelize to add user
        return Models.User.update(
          {
            name: args.name,
            image: args.image,
            description: args.description,
            locationOfResidence: args.locationOfResidence,
            cityOfResidence: args.cityOfResidence,
            stateOfResidence: args.stateOfResidence,
            lat: args.lat,
            lng: args.lng
          },
          { where: { id: args.id } }
        )
          .then((data) => {
            console.log('updated lesson', data);
            return data;
          })
          .catch((err) => console.error(err));
      }
    },
    updateLesson: {
      type: LessonType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        image: { type: GraphQLString },
        description: { type: GraphQLString },
        locationOfService: { type: GraphQLString },
        cityOfService: { type: GraphQLString },
        stateOfService: { type: GraphQLString },
        lat: { type: GraphQLFloat },
        lng: { type: GraphQLFloat },
        category: { type: GraphQLString },
        difficulty: { type: GraphQLString },
        price: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        return Models.Lesson.update(
          {
            title: args.title,
            description: args.description,
            category: args.category,
            locationOfService: args.locationOfService,
            cityOfService: args.cityOfService,
            stateOfService: args.stateOfService,
            lat: args.lat,
            lng: args.lng,
            difficulty: args.difficulty,
            image: args.image,
            userId: args.userId,
            price: args.price
          },
          { returning: true, where: { id: args.id } }
        )
          .then((data) => {
            console.log('edit lesson', data[1]);
            return data;
          })
          .catch((err) => console.error(err));
      }
    }
  }
});

const updateRating = (q, avg, r) => {
  let result = (q * avg + r) / (q + 1);
  return result;
};

module.exports = Mutation;
