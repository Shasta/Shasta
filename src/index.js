import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'

import './index.css';
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
import { faHome, faBars, faUsers, faMap, faTimes, faCog, faBolt, faShoppingCart,faCheck, faMoneyCheck, faFilter } from '@fortawesome/free-solid-svg-icons'

library.add(faHome, faUsers, faTimes, faCheck, faBars, faMap, faCog, faBolt,faMoneyCheck, faFilter, faShoppingCart)

ReactDOM.render((
    <DrizzleContext.Provider drizzle={drizzle}>
      <Provider store={store}>
        <App />
      </Provider>
    </DrizzleContext.Provider>
  ),
  document.getElementById('root')
);
