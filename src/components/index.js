import React, { Component } from 'react';

import Menu from './Menu/index';
import Sidebar from './Sidebar/index';


class App extends React.Component {
  render() {
    return (
      <div>
        <Menu></Menu>
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default App;
