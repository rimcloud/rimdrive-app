import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import HomePage from "components/views/HomePage";
import LoginPage from "components/views/LoginPage";
import MainPage from "components/views/MainPage";

class RCRouters extends Component {
    render() {
        return (
            <div>
                <Switch>
                  <Route exact path="/" name="Home" component={HomePage} />
                  <Route path="/Login" name="Login" component={LoginPage} />
                  <Route exact path="/Main" name="Main" component={MainPage} />
                </Switch>
            </div>
        );
    }
}


export default RCRouters;

