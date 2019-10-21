import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import './styles/application.scss';
import App from './App';
import Commerce from '@chec.io/commerce';

const commercejsConfig = {
  axiosConfig: {
    headers: {
      "X-Chec-Agent": "commerce.js/v1"
    }
  }
}

const commerce = new Commerce(process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY, (process.env.NODE_ENV === 'development') ? true : false, commercejsConfig);
ReactDOM.render(<Router><App commerce={commerce}/></Router>, document.getElementById('root'));
