import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import { DrizzleContext } from 'drizzle-react';
import drizzle from './drizzleOptions';
import './index.css';

import 'semantic-ui-css/semantic.min.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faBars, faUsers, faMap, faTimes, faCog, faBolt, faDigitalTachograph,faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faHome, faUsers, faTimes, faCheck, faBars, faMap, faCog, faBolt, faDigitalTachograph)

ReactDOM.render((
    <DrizzleContext.Provider drizzle={drizzle}>
      <App />
    </DrizzleContext.Provider>
  ),
  document.getElementById('root')
);
