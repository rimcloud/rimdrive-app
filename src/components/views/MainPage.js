import React, { Component } from "react";

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as GlobalActions from 'modules/GlobalModule';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { getAppRoot } from 'components/utils/RCCommonUtil';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import InfoPage from 'components/views/InfoPage';
import SharePage from 'components/views/SharePage';
import SyncPage from 'components/views/SyncPage';
import SetupPage from 'components/views/SetupPage';


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

    componentDidMount() {
        const { GlobalActions } = this.props;
        // load and init rimdrive config
        const adapter = new FileSync(getAppRoot() + 'config/rimdrive.json');
        const driveConfig = low(adapter);

        if(driveConfig !== undefined && driveConfig.get('syncItems').value() === undefined) {
            driveConfig.assign({syncItems: []}).write();
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


    render() {
        const { classes } = this.props;
        const selectedTab = this.state.selectedTab;

        return (
            <React.Fragment>
                <div className={classes.mainPage} > 
                    <div>VAR => {getAppRoot()} ::: {process.platform}</div>
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
