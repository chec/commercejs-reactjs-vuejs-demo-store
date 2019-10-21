import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import './styles/application.scss';
import App from './App';

ReactDOM.render(<Router><App/></Router>, document.getElementById('root'));
