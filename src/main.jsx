import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './utils/store';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
