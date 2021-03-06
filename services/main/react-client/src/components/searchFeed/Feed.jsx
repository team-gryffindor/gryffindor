import React from 'react';
import LessonList from '../lessonList/LessonList.jsx';

const Feed = ({ location }) => {
  return (
    <div className="container">
      <h1>
        {location.state.locationQuery
          ? `Search Results for "${location.state.serviceQuery}" near ${
              location.state.locationQuery
            }`
          : `Search Results for "${location.state.serviceQuery}"`}{' '}
      </h1>
      <LessonList lessonIds={location.state.lessonIds} />
    </div>
  );
};

export default Feed;
