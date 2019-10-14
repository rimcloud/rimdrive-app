import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

class HomePage extends Component {

    handleStartBtnClick = (e) => {
        console.log('HomePage -> handleStartBtnClick...');
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className={classes.homePage}>
                    <div className={classes.rcMainTitle}>
                            RIMDRIVE Ver 0.1
                    </div>
                    <div style={{textAlign:"center"}}>
                        <Button className={classes.RCSmallButton} 
                            variant="contained" color="secondary" 
                            onClick={this.handleStartBtnClick} 
                            component={Link}
                            to="/Login">
                            START
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(CommonStyle)(HomePage);
