import React, { Component } from "react";
import { Redirect } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';
// import log from 'electron-log';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as AccountActions from 'modules/AccountModule';

import ServerSettingDialog from 'components/parts/ServerSettingDialog';

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

    handleLoginBtnClick = (e) => {
        const { AccountActions, AccountProps } = this.props;

        if(AccountProps.get('userId') === '' || AccountProps.get('password') === '') {
            AccountActions.setInfoMessageData({
                msg: '아이디 또는 패스워드가 입력되지 않았습니다.'
            })
        } else {
            AccountActions.reqLoginProcess(AccountProps.get('userId'), AccountProps.get('password')).then(data => {
                // log.debug('handleLoginBtnClick resolve data :::: ', data);
            });
        }
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
                if(msg.indexOf('<BR>') > -1) {
                    msg = msg.split('<BR>').join();
                }
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
                <Typography className={classes.footer} variant='caption' gutterBottom={true} align='center'>c l o u d r i m, co.</Typography>
                <ServerSettingDialog open={this.state.openSettingDialog}
                    onClose={this.handleCloseSetting}
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
