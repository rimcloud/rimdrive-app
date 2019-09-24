import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

function TabPanel(props) {

    const { children, value, index, ...other } = props;
    console.log('TabPanel  ', index);
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}
class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }


    handleStartBtnClick = (e) => {
        console.log(e);
    }

    handleChange = (event, newValue) => {

        console.log(newValue);

        this.setState({
            value: newValue
        });
    };

    render() {
        const { classes } = this.props;
        const value = this.state.value;

        return (
            <React.Fragment>
            <div className={classes.mainPage} >
                <AppBar position="absolute">
                    <Tabs value={value} onChange={this.handleChange} aria-label="simple tabs example">
                        <Tab label="정보" {...a11yProps(0)} />
                        <Tab label="동기화" {...a11yProps(1)} />
                        <Tab label="환경설정" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0} style={{border: '1px solid yellow'}}>
                    Item One
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>


                <div className={classes.rcMainTitle}>
                    MAIN
                </div>
                <div style={{ textAlign: "center" }}>
                    ----<br />
                    ----<br />
                    ----<br />
                    ----<br />
                    ----<br />
                </div>
            </div>
            </React.Fragment>
        );
    }
}


export default withStyles(CommonStyle)(MainPage);

