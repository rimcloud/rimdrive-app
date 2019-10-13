import React, { Component } from "react";
// import { Map, fromJS } from 'immutable';
// import fs from 'fs';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { Link } from 'react-router-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as GlobalActions from 'modules/GlobalModule';

import Button from '@material-ui/core/Button';

class HomePage extends Component {

    componentDidMount() {
        console.log('HomePage -> componentDidMount.=============');
        const { GlobalActions } = this.props;

        const adapter = new FileSync(__dirname + '/db.json');
        // const db = low(adapter);

        GlobalActions.setDataStorage({
            dataStorage: low(adapter)
        });

        // File read (json) temp delete

        // const syncData = fs.readFileSync('rimdrive-app.cfg', 'utf8');
        // console.log('syncData ::', syncData);

        // if(syncData !== undefined && syncData !== '') {
        //     GlobalActions.initSyncData({
        //         syncData: fromJS(JSON.parse(syncData))
        //     });
        // }
    }

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


const mapStateToProps = (state) => ({
    GlobalProps: state.GlobalModule
});

const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(HomePage));

