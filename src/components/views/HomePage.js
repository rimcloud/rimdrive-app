import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


class HomePage extends Component {

    handleStartBtnClick = (e) => {
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.homePage} color="primary">
                <div className={classes.rcMainTitle}>
                    RIMDRIVE Ver 0.1
                </div>
                <div style={{textAlign:"center"}}>
                    <Button className={classes.RCSmallButton} 
                        variant="contained" color="primary" 
                        onClick={this.handleStartBtnClick} 
                        component={Link}
                        to="/Login">
                        START
                    </Button>
                </div>
                <Typography className={classes.footer} variant='caption' gutterBottom={true} align='center'>c l o u d r i m, co.</Typography>
            </Paper>
        );
    }
}

export default withStyles(CommonStyle)(HomePage);
