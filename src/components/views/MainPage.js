import React, { Component } from "react";
import { Redirect } from 'react-router';
 
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import log from 'electron-log';

import * as GlobalActions from 'modules/GlobalModule';
import * as AccountActions from 'modules/AccountModule';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { handleSyncTimer, setInitConfigData } from 'components/utils/RCSyncUtil';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import InfoPage from 'components/views/InfoPage';
import SharePage from 'components/views/SharePage';
import SyncPage from 'components/views/SyncPage';
import RCDialogConfirm from 'components/utils/RCDialogConfirm';
import Typography from '@material-ui/core/Typography';

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
            selectedTab: 0,
            syncIntervaler: null
        };
    }

    componentDidMount() {
        const { GlobalProps, AccountProps } = this.props;
        const driveConfig = GlobalProps.get('driveConfig');

        if (driveConfig !== undefined) {
            // only use one sync-item for this version
            if(driveConfig.get('syncItems').value()[0].type === 'a') {
                // start sync interval
                handleSyncTimer('start');
            }
        }

        setInitConfigData(driveConfig, AccountProps.get('userId'));
    }

    handleChange = (event, newValue) => {
        this.setState({
            selectedTab: newValue
        });
    };
    //aaa;

    handleLogout = () => {
        this.props.GlobalActions.showConfirm({
            confirmTitle: "로그아웃",
            confirmMsg: "로그아웃 하시겠습니까?",
            handleConfirmResult: (confirmValue, paramObject) => {
                if (confirmValue) {
                    const { AccountProps, AccountActions } = this.props;
                    AccountActions.reqLogoutProcess(AccountProps.get('userId'));
                }
            },
            confirmObject: null
        });
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
                <Typography className={classes.footer} variant='caption' gutterBottom={true} align='center'>c l o u d r i m, co.</Typography>
                <RCDialogConfirm />
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
