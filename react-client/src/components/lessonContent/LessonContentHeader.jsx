import React from 'react';
import { Mutation } from 'react-apollo';
import {
  ADD_FAVORITE_LESSON,
  DELETE_FAVORITE_LESSON,
  ADD_SIGNUP_LESSON,
  DELETE_SIGNUP_LESSON,
  GET_USER
} from '../../apollo/resolvers/backendQueries.js';
import { extractCityState } from '../../util/addressHelper.js';

import Checkout from '../checkout/Checkout.jsx';
import BookNow from './BookNow.jsx';

const LessonContentHeader = ({
  userCompletedPayment,
  paid,
  renderPayment,
  payNow,
  lesson,
  isFavorite,
  isBooked,
  toggleFavorite,
  toggleBooking,
  userId
}) => {
  let mutateFav = ADD_FAVORITE_LESSON;
  if (isFavorite) mutateFav = DELETE_FAVORITE_LESSON;
  let mutateBooking = ADD_SIGNUP_LESSON;
  if (isBooked) mutateBooking = DELETE_SIGNUP_LESSON;
  console.log('checking if booked', isBooked);
  let { city, state } = extractCityState(lesson.location.addressComponents);
  return (
    <div className="lesson-detail-header-margin-top">
      <div className="jumbotron">
        <span className="badge badge-pill badge-primary">{lesson.category}</span>
        <div className="d-flex w-100 justify-content-between">
          <h1>{lesson.title}</h1>
          <small className="text">
            <p style={{ textAlign: 'right' }}>
              Location: {city}, {state}
              <br />
              Difficulty: {lesson.difficulty} + {lesson.id}
              <br />
              Price: ${lesson.price}
              /hour
            </p>
          </small>

          {/* wrap this in a mutation tag and refectch here? */}
          <Mutation
            mutation={mutateFav}
            refetchQueries={[{ query: GET_USER, variables: { id: userId } }]}
          >
            {(mutateFavorite) => (
              <button
                type="button"
                className="btn btn-default"
                onClick={() => {
                  mutateFavorite({
                    variables: {
                      userId: userId,
                      lessonId: lesson.id
                    }
                  }).then((data) => {
                    toggleFavorite(!isFavorite);
                  });
                }}
              >
                {isFavorite ? <i className="fas fa-star" /> : <i className="far fa-star" />}
              </button>
            )}
          </Mutation>
        </div>
        <h4>About your Lesson</h4>
        <p className="lead">{lesson.description}</p>
        <hr className="my-4" />
        <div>
          <img src={lesson.provider.image} className="profile-image" />
          <h4>About your mentor, {lesson.provider.name}</h4>
          <p>{lesson.provider.description}</p>
        </div>
        <p className="lead text-right">
          {isBooked ? (
            <button onClick={() => toggleBooking(false)}>Cancel Booking</button>
          ) : (
            <button onClick={() => renderPayment(true)}>Pay Now</button>
          )}
          {payNow ? <Checkout userCompletedPayment={userCompletedPayment} lesson={lesson} /> : null}

          {paid ? (
            <Mutation mutation={mutateBooking}>
              {(changeBooking) => (
                <button
                  className="btn btn-highlight btn-lg"
                  href="#"
                  role="button"
                  onClick={() => {
                    changeBooking({
                      variables: {
                        userId: userId,
                        lessonId: lesson.id,
                        date: '1'
                      }
                    }).then((data) => {
                      toggleBooking(!isBooked);
                    });
                  }}
                >
                  Confirm Booking!
                </button>
              )}
            </Mutation>
          ) : null}
          {isBooked ? (
            <button onClick={() => toggleBooking(false)}>Cancel Booking</button>
          ) : (
            <BookNow event={lesson} userId={userId} renderPayment={renderPayment} />
          )}
        </p>
      </div>
    </div>
  );
};

export default LessonContentHeader;
