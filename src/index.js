import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import { DrizzleContext } from 'drizzle-react';
import drizzle from './drizzleOptions';
import './index.css';

import 'semantic-ui-css/semantic.min.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faUsers, faMap, faCog, faBolt, faDigitalTachograph } from '@fortawesome/free-solid-svg-icons'

library.add(faHome, faUsers, faMap, faCog, faBolt, faDigitalTachograph)

ReactDOM.render((
    <DrizzleContext.Provider drizzle={drizzle}>
      <App />
    </DrizzleContext.Provider>
  ),
  document.getElementById('root')
);
