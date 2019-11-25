import React, { Component } from "react";
import { Redirect } from 'react-router';
import path from 'path';
 
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import * as GlobalActions from 'modules/GlobalModule';
import * as AccountActions from 'modules/AccountModule';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { getAppRoot } from 'components/utils/RCCommonUtil';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import InfoPage from 'components/views/InfoPage';
import SharePage from 'components/views/SharePage';
import SyncPage from 'components/views/SyncPage';


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

function intervalFunc() {
    return setInterval(() => {
        console.log('interviewing the interval');
    }, 3000);
}

class MainPage extends Component {

    constructor(props) {
        super(props);

        console.log('props ::: ', props);

        this.state = {
            selectedTab: 0,
            syncIntervaler: null
        };
    }

    componentDidMount() {
        const { GlobalActions } = this.props;
        // load and init rimdrive config
        const adapter = new FileSync(`${getAppRoot()}${path.sep}rimdrive.json`);
        const driveConfig = low(adapter);

        if (driveConfig !== undefined && driveConfig.get('syncItems').value() === undefined) {
            // init sync item
            driveConfig.assign({
                syncItems: [{
                    "no": 1,
                    "local": "",
                    "cloud": "",
                    "type": "m",
                    "status": "on",
                    "files": []
                }]
            }).write();
        }

        GlobalActions.setDataStorage({
            driveConfig: driveConfig
        });
    }

    handleChange = (event, newValue) => {
        this.setState({
            selectedTab: newValue
        });
    };

    handleLogout = () => {
        const { AccountProps, AccountActions } = this.props;
        AccountActions.reqLogoutProcess(AccountProps.get('userId'));
    }

    render() {
        const { classes } = this.props;
        const { AccountProps } = this.props;
        const selectedTab = this.state.selectedTab;

        if (AccountProps && AccountProps.get('userToken') === '') {
            return <Redirect push to ='/Login' />;
        }

        return (
            <React.Fragment>
                <div className={classes.mainPage} >
                    {/*<div>VAR => {getAppRoot()} ::: {process.platform}</div>*/}
                    <AppBar position="relative" className={classes.mainTab}>
                        <Tabs value={selectedTab} onChange={this.handleChange} aria-label="simple tabs example">
                            <Tab label="정보" {...a11yProps(0)} />
                            <Tab label="공유" {...a11yProps(1)} />
                            <Tab label="동기화" {...a11yProps(2)} />
                        </Tabs>
                        <Button style={{position:'absolute',right:'0',marginTop:'6px',color:'lightgray'}} 
                            onClick={this.handleLogout}
                        >로그아웃</Button>
                    </AppBar>
                    {selectedTab === 0 && <InfoPage />}
                    {selectedTab === 1 && <SharePage />}
                    {selectedTab === 2 && <SyncPage />}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    GlobalProps: state.GlobalModule,
    AccountProps: state.AccountModule
});

const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    AccountActions: bindActionCreators(AccountActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(MainPage));
