/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import './App.css';

const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="grid mx-auto px-4 mt-5">
      <div className="mx-auto p-6 text-xl border border-solid border-blue-500">
        My Daily News App
        {console.log(`${firstName} has a pet called ${name}`)}
      </div>
      <div className="mx-auto p-4">
        <Search onSearch={handleSearch} search={searchTerm} />
      </div>
      <div>
        <List list={searchedStories} />
      </div>
    </div>
  );
};

const Search = ({ search, onSearch }) => {
  <div className="p-4 mx-auto">
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" value={search} onChange={onSearch} />
  </div>;
};

const List = ({ list }) => (
  <ul>
    {list.map(item => (
      <Item key={item.objectID} title={item.title} url={item.url} author={item.author} num_comments={item.num_comments} points={item.points} />
    ))}
  </ul>
);

const Item = ({ title, url, author, num_comments, points }) => (
  <li>
    <div>
      {author}
      <a href={url}>{title}</a>
    </div>
    <div>{num_comments}</div>
    <div>{points}</div>
  </li>
);

export default App;
