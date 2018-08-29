import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import './index.css';

import 'semantic-ui-css/semantic.min.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

library.add(faHome)

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
