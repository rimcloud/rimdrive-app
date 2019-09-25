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
import Paper from '@material-ui/core/Paper';



import InfoPage from 'components/views/InfoPage';
import SyncPage from 'components/views/SyncPage';
import SetupPage from 'components/views/SetupPage';

function TabPanel(props) {

    const { children, selectedTab, index, ...other } = props;
    if (index === 0) {
        console.log('InfoPage  ', InfoPage);
        return (
            <SyncPage />
        );
    } else if (index === 1) {
        console.log('SyncPage  ', SyncPage);
        return (
            <SyncPage />
        );
    } else if (index === 2) {
        console.log('SetupPage  ', SetupPage);
        return (
            <SetupPage />
        );
    } else {
        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={selectedTab !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                <Box p={3}>{children}</Box>
            </Typography>
        );
    }
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
            selectedTab: 0
        };
    }


    handleStartBtnClick = (e) => {
        console.log(e);
    }

    handleChange = (event, newValue) => {

        console.log(newValue);

        this.setState({
            selectedTab: newValue
        });
    };

    render() {
        const { classes } = this.props;
        const selectedTab = this.state.selectedTab;

        return (
            <React.Fragment>
                <div className={classes.mainPage} >
                    <AppBar position="relative" style={{backgroundColor:'#2c387b'}}>
                        <Tabs value={selectedTab} onChange={this.handleChange} aria-label="simple tabs example">
                            <Tab label="정보" {...a11yProps(0)} />
                            <Tab label="동기화" {...a11yProps(1)} />
                            <Tab label="환경설정" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                        {selectedTab === 0 && <InfoPage />}
                        {selectedTab === 1 && <SyncPage />}
                        {selectedTab === 2 && <SetupPage />}
                </div>
            </React.Fragment>
        );
    }
}


export default withStyles(CommonStyle)(MainPage);

