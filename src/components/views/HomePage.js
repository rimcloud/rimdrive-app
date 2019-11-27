import React, { Component } from "react";
import path from 'path';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { Link } from 'react-router-dom';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import * as GlobalActions from 'modules/GlobalModule';

import { getAppRoot } from 'components/utils/RCCommonUtil';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


class HomePage extends Component {

    componentDidMount() {
    }

    handleStartBtnClick = (e) => {
        // load and init rimdrive config
        const adapter = new FileSync(`${getAppRoot()}${path.sep}rimdrive.json`);
        const driveConfig = low(adapter);

        if (driveConfig !== undefined) {
            if (driveConfig.get('syncItems').value() === undefined || driveConfig.get('syncItems').value().length < 1) {
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

            if (driveConfig.get('serverConfig').value() === undefined) {
                // init sync item
                driveConfig.assign({
                    serverConfig: {
                        "protocol": "",
                        "hostname": "",
                        "port": ""
                    }
                }).write();
            } else {
                this.props.GlobalActions.setServerConfig({
                    protocol: driveConfig.get('serverConfig.protocol').value(),
                    hostname: driveConfig.get('serverConfig.hostname').value(),
                    port: driveConfig.get('serverConfig.port').value()
                });
            }
        }

        this.props.GlobalActions.setDataStorage({
            driveConfig: driveConfig
        });
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

const mapStateToProps = (state) => ({
    GlobalProps: state.GlobalModule
});

const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(HomePage));
