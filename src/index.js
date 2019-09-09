import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import './styles/application.scss';
import App from './App';

const commerce = new window.Commerce(process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY, (process.env.NODE_ENV === 'development') ? true : false);
ReactDOM.render(<Router><App commerce={commerce}/></Router>, document.getElementById('root'));
