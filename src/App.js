import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import MainFull from './containers/MainFull/';

class App extends Component {
  render() {
      console.log('============================');
      console.log(MainFull);
      return (
          <div>
              <Route path="/" component={MainFull}/>
          </div>
      );
  }
}

export default App;
