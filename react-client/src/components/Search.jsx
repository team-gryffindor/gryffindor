import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { GET_LESSONS } from '../apollo/resolvers/backendQueries.js';
import axios from 'axios';
import SearchBar from './SearchBar.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SearchBar />
        <Query query={GET_LESSONS}>
          {({ loading, error, data }) => {
            if (error) return <h1>Error...</h1>;
            if (loading || !data) return <h1>Loading...</h1>;
            return (
              <ul>
                {data.lessons.map((lesson) => {
                  return (
                    <div>
                      <h1>{lesson.title}</h1>
                      <h2>{lesson.avgRating}</h2>
                    </div>
                  );
                })}
              </ul>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Search;
