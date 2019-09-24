import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

class HomePage extends Component {

    handleStartBtnClick = (e) => {
        console.log(e);
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
            <div className={classes.rcMainTitle}>
                    RIMDRIVE
            </div>
            <div style={{textAlign:"center"}}>
                <Button className={classes.GRIconSmallButton} 
                    variant="contained" color="secondary" 
                    onClick={this.handleStartBtnClick} 
                    component={Link}
                    to="/Login">
                    START
                </Button>
            </div>
            </React.Fragment>
        );
    }
}


export default withStyles(CommonStyle)(HomePage);

