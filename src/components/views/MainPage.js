import React, { Component } from "react";
import electron from 'electron';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as GlobalActions from 'modules/GlobalModule';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import InfoPage from 'components/views/InfoPage';
import SharePage from 'components/views/SharePage';
import SyncPage from 'components/views/SyncPage';
import SetupPage from 'components/views/SetupPage';

const path = require('path');

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

function getAppRoot() {
    if ( process.platform === 'win32' ) {
      return path.join( electron.remote.app.getAppPath(), '/../../../' );
    }  else {
      return path.join( electron.remote.app.getAppPath(), '/../../../../' );
    }
}

class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        };
    }

    componentDidMount() {
        const { GlobalActions } = this.props;
        const confFile = getAppRoot() + 'rimdrive.json';
        const adapter = new FileSync(confFile);

        const test = low(adapter);
        test.set({test: '11111'}).write();
        
        GlobalActions.setDataStorage({
            driveConfig: low(adapter)
        });
    }

    handleChange = (event, newValue) => {
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
                <div>TEST1 : {electron.remote.app.getAppPath()}</div>
                <div>TEST2 : {process.platform}</div>
                <div>TEST3 : {path.join( electron.remote.app.getAppPath(), '/../../../' )}</div>
                    <AppBar position="relative" style={{backgroundColor:'#2c387b'}}>
                        <Tabs value={selectedTab} onChange={this.handleChange} aria-label="simple tabs example">
                            <Tab label="정보" {...a11yProps(0)} />
                            <Tab label="공유" {...a11yProps(1)} />
                            <Tab label="동기화" {...a11yProps(2)} />
                            <Tab label="환경설정" {...a11yProps(3)} />
                        </Tabs>
                    </AppBar>
                        {selectedTab === 0 && <SharePage />}
                        {selectedTab === 1 && <InfoPage />}
                        {selectedTab === 2 && <SyncPage />}
                        {selectedTab === 3 && <SetupPage />}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    GlobalProps: state.GlobalModule
});

const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(MainPage));
