import React, { Component } from 'react';

import Menu from './Menu/index';
import Sidebar from './Sidebar/index';
import Home from './Home/index';


class App extends React.Component {
  render() {
    return (
      <div>
        <Menu></Menu>
        <Sidebar></Sidebar>
        <Home></Home>
      </div>
    );
  }
}

export default App;
