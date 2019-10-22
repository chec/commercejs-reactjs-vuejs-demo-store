import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import ScrollToTop from './lib/ScrollToTop';
import './styles/application.scss';
import App from './App';

ReactDOM.render(<Router><ScrollToTop><App/></ScrollToTop></Router>, document.getElementById('root'));
