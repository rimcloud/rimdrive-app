import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import MainFull from 'containers/MainFull';

class App extends Component {
  render() {
      return (
          <div>
              <Route path="/" component={MainFull}/>
          </div>
      );
  }
}

export default App;
