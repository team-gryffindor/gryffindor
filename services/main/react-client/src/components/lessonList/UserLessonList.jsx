import React from 'react';
import { Link } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import { GET_USER, DELETE_LESSON } from '../../apollo/resolvers/backendQueries.js';

import UserLessonListItem from './UserLessonListItem.jsx';

// pass in favoriteLessons, offeredLessons, signupLessons as props
const UserLessonList = ({ userId, lessonType, upcoming, style }) => {
  // figure out date filter
  return (
    <Query query={GET_USER} variables={{ id: String(userId) }}>
      {({ loading, error, data }) => {
        if (error) return <small>error</small>;
        if (loading) {
          return null;
        } else {
          let lessons = data.user[lessonType];
          if (lessonType === 'signupLessons') {
            if (upcoming) {
              return (
                <div className={`${style} list-group`}>
                  {lessons.filter((lesson) => lesson.date > Date.now()).map((lesson, i) => (
                    <UserLessonListItem lesson={lesson} key={i} />
                  ))}
                </div>
              );
            } else {
              return (
                <div className={`${style} list-group`}>
                  {lessons.filter((lesson) => lesson.date < Date.now()).map((lesson, i) => (
                    <div className="row">
                      <div className="col-md-10">
                        <UserLessonListItem lesson={lesson} key={i} taken={true} userId={userId} />
                      </div>
                      <div className="col-md-2">
                        <Link
                          to={{
                            pathname: `/writeReview/${lesson.id}`,
                            lesson: { lesson: lesson },
                            userId: { userId: userId }
                          }}
                        >
                          <button className="btn btn-primary mb-2">Review</button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
          }
          return (
            <div className={`${style} list-group`}>
              {lessons.filter((lesson) => lesson.isActive).map((lesson, i) => (
                <div>
                  <div className="row">
                    <div className="col-md-10">
                      <UserLessonListItem lesson={lesson} key={i} />
                    </div>
                    <div className="col-md-2">
                      <Mutation
                        mutation={DELETE_LESSON}
                        refetchQueries={[{ query: GET_USER, variables: { id: userId } }]}
                      >
                        {(deleteLesson) => {
                          if (lessonType === 'offeredLessons') {
                            return (
                              <button
                                className="btn btn-primary mb-2"
                                onClick={() => {
                                  deleteLesson({
                                    variables: { id: lesson.id }
                                  })
                                    .then((data) => data)
                                    .catch((err) => console.error(err));
                                }}
                              >
                                Delete
                              </button>
                            );
                          } else {
                            return null;
                          }
                        }}
                      </Mutation>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        }
      }}
    </Query>
  );
};

export default UserLessonList;
