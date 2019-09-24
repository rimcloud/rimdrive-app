import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

class MainPage extends Component {

    handleStartBtnClick = (e) => {
        console.log(e);
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
            <div className={classes.rcMainTitle}>
                    MAIN
            </div>
            <div style={{textAlign:"center"}}>
            ----<br />
            ----<br />
            ----<br />
            ----<br />
            ----<br />
            </div>
            </React.Fragment>
        );
    }
}


export default withStyles(CommonStyle)(MainPage);

