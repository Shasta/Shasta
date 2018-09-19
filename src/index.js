import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'

import './index.css'; 
import "semantic-ui-less/semantic.less";

// Drizzle
import { DrizzleContext } from "drizzle-react";
import { Drizzle, generateStore } from "drizzle";
import drizzleOptions from './drizzleOptions';
// Redux Store
import { history, store } from './store'
import {Provider} from 'react-redux';
// Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faBars, faUsers, faMap, faTimes, faCog, faBolt, faShoppingCart,faCheck, faMoneyCheck, faFilter, faDigitalTachograph } from '@fortawesome/free-solid-svg-icons'

const drizzle = new Drizzle(drizzleOptions, store)


library.add(faHome, faUsers, faTimes, faCheck, faBars, faMap, faCog, faBolt,faMoneyCheck, faFilter, faShoppingCart, faDigitalTachograph)
ReactDOM.render((
    <DrizzleContext.Provider drizzle={drizzle}>
      <Provider store={store}>
        <App />
      </Provider>
    </DrizzleContext.Provider>
  ),
  document.getElementById('root')
);
