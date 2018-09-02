import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import './index.css';

import 'semantic-ui-css/semantic.min.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faUsers, faMap, faCog, faDigitalTachograph } from '@fortawesome/free-solid-svg-icons'

library.add(faHome, faUsers, faMap, faCog, faDigitalTachograph)

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
