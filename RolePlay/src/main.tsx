import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App/AppComponent';
import './main.png';
import 'App/Styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
