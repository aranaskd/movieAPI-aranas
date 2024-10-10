import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root')
);