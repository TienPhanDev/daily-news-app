/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
import * as React from 'react';
import './App.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useCustomHook = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState,
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.filter(story => action.payload.objectID !== story.objectID),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useCustomHook('search', 'React');
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(url)
      .then(response => response.json())
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        });
      })
      .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }));
  }, [searchTerm, url]);

  const handleRemove = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  return (
    <div className="grid px-4 mt-5">
      <div className="mx-auto p-4 text-lg border border-solid border-blue-500">
        Daily News
      </div>
      <div className="mx-auto p-4">
        <CustomInput
          id="search"
          value={searchTerm}
          isFocused
          onInputChange={handleSearch}
        >
          <strong>Search:</strong>
        </CustomInput>
      </div>
      <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
        Submit
      </button>
      <div>
        {stories.isError && <p>Something went wrong ...</p>}
        {stories.isLoading ? (
          <p>Loading.....</p>
        ) : (
          <List list={stories.data} onRemoveItem={handleRemove} />
        )}
      </div>
    </div>
  );
};

const CustomInput = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => (
  <div>
    <div>
      {item.author}
      <a href={item.url}>{item.title}</a>
    </div>
    <div>{item.numComments}</div>
    <div>{item.points}</div>
    <span>
      <button
        type="button"
        onClick={() => onRemoveItem(item)}
        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
      >
        Delete
      </button>
    </span>
  </div>
);

export default App;
