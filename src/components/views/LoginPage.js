import React, { Component } from "react";
import { Redirect } from 'react-router';
import path from 'path';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';
import log from 'electron-log';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import * as GlobalActions from 'modules/GlobalModule';
import * as AccountActions from 'modules/AccountModule';

import { getAppRoot } from 'components/utils/RCCommonUtil';

import SettingDialog from 'components/parts/SettingDialog';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SettingIcon from '@material-ui/icons/SettingsApplicationsOutlined';

const CustomCssTextField = withStyles({
    root: {
        "& .MuiFormLabel-root.Mui-focused ": {
            color: "red"
        },
        "& .MuiInput-underline:before ": {
            color: "gray",
            borderBottom: "2px solid gray"
        },
        "& .MuiInput-underline:after ": {
            color: "red",
            borderBottom: "2px solid red"
        }
    }
})(TextField);

class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.passwordInput = React.createRef();
        this.focusTextInput = this.focusTextInput.bind(this);

        this.state = {
            openSettingDialog: false
        };
    }


    // componentDidMount() {

    //     // load and init rimdrive config
    //     const adapter = new FileSync(`${getAppRoot()}${path.sep}rimdrive.json`);
    //     const driveConfig = low(adapter);

    //     if (driveConfig !== undefined) {
    //         if (driveConfig.get('syncItems').value() === undefined || driveConfig.get('syncItems').value().length < 1) {
    //             // init sync item
    //             driveConfig.assign({
    //                 syncItems: [{
    //                     "no": 1,
    //                     "local": "",
    //                     "cloud": "",
    //                     "type": "m",
    //                     "status": "on",
    //                     "files": []
    //                 }]
    //             }).write();
    //         }

    //         if (driveConfig.get('serverConfig').value() === undefined) {
    //             // init sync item
    //             driveConfig.assign({
    //                 serverConfig: {
    //                     "protocol": "11",
    //                     "hostname": "22",
    //                     "port": "33"
    //                 }
    //             }).write();
    //         }
    //     }

    //     this.props.GlobalActions.setDataStorage({
    //         driveConfig: driveConfig
    //     });
    // }




    handleLoginBtnClick = (e) => {
        const { AccountActions, AccountProps } = this.props;
        AccountActions.reqLoginProcess(AccountProps.get('userId'), AccountProps.get('password')).then(data => {
            // log.debug('handleLoginBtnClick resolve data :::: ', data);
        });
    }

    handleChangeValue = name => event => {
        this.props.AccountActions.changeAccountParamData({
            name: name,
            value: event.target.value
        });
    }

    handleOpenSetting = () => {
        this.setState({
            openSettingDialog: true
        });
    }

    handleCloseSetting = () => {
        this.setState({
            openSettingDialog: false
        });
    }

    handleSaveServerConfig = (param) => {
        const { GlobalProps, GlobalActions } = this.props;
        const driveConfig = GlobalProps.get('driveConfig');
        driveConfig.get('serverConfig')
        .assign(param).write();
        GlobalActions.setServerConfig(param);
    }

    focusTextInput() {
        this.passwordInput.current.focus();
    }

    focusUsernameInputField = input => {
        input && input.focus();
    };

    render() {
        const { classes } = this.props;
        const { AccountProps } = this.props;

        if (AccountProps && AccountProps.get('userToken') !== '') {
            return <Redirect push to='/Main' />;
        }

        let msg = 'ID, Password를 입력하세요.';
        if (AccountProps) {
            if (AccountProps.get('message') !== undefined && AccountProps.get('message') !== '') {
                msg = AccountProps.get('message');
            }
        }

        return (
            <div>
                <AppBar className={classes.loginHeader} elevation={0} square={true}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}></Typography>
                            <IconButton color="inherit" onClick={this.handleOpenSetting} aria-label="setting">
                                <SettingIcon style={{height:34,width:34,color:'gray'}} />
                            </IconButton>
                    </Toolbar>
                </AppBar>

                <div className={classes.homePage}>
                    <div>
                        <CustomCssTextField label="ID" margin="normal" autoFocus
                            value={AccountProps.get('userId')}
                            onChange={this.handleChangeValue('userId')}
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    this.focusTextInput();
                                    ev.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <div>
                        <CustomCssTextField label="Password" margin="normal"
                            value={AccountProps.get('password')}
                            onChange={this.handleChangeValue('password')}
                            type="password"
                            autoComplete="current-password"
                            inputRef={this.passwordInput}
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    this.handleLoginBtnClick();
                                    ev.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <div className={classes.rcMainTitle}>
                        <Button className={classes.RCSmallButton}
                            variant="contained" color="primary"
                            onClick={this.handleLoginBtnClick} >
                            login
                        </Button>
                    </div>
                    <Typography>{msg}</Typography>
                </div>
                <div className={classes.footer}>
                    <Typography variant='caption' gutterBottom={true} align='center'>c l o u d r i m, co.</Typography>
                </div>
                <SettingDialog open={this.state.openSettingDialog}
                    onClose={this.handleCloseSetting}
                    onSaveServerConfig={this.handleSaveServerConfig}
                />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(LoginPage));
