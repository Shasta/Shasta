import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import './index.css';
import { Router } from 'react-router'
import 'semantic-ui-css/semantic.min.css';

// Drizzle
import { DrizzleContext } from "drizzle-react";
import { Drizzle, generateStore } from "drizzle";
import drizzleOptions from './drizzleOptions';
// Redux Store
import { history, store } from './store'
import {Provider} from 'react-redux';

const drizzle = new Drizzle(drizzleOptions, store)

// Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faBars, faUsers, faMap, faTimes, faCog, faBolt, faDigitalTachograph,faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faHome, faUsers, faTimes, faCheck, faBars, faMap, faCog, faBolt, faDigitalTachograph)

ReactDOM.render((
    <DrizzleContext.Provider drizzle={drizzle} store={store}>
      <Provider store={store}>
        <Router history={history} store={store}>
          <App />
        </Router>
      </Provider>
    </DrizzleContext.Provider>
  ),
  document.getElementById('root')
);
