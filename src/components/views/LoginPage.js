import React, { Component } from "react";
import { Redirect } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountActions from 'modules/AccountModule';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

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
    }

    handleLoginBtnClick = (e) => {
        const { AccountActions, AccountProps } = this.props;
        AccountActions.reqLoginProcess(AccountProps.get('userId'), AccountProps.get('password')).then(data => {
            // console.log('handleLoginBtnClick resolve data :::: ', data);
        });
    }

    handleChangeValue = name => event => {
        this.props.AccountActions.changeAccountParamData({
            name: name,
            value: event.target.value
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
            }
        }

        return (
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
        );
    }
}

const mapStateToProps = (state) => ({
    AccountProps: state.AccountModule
});

const mapDispatchToProps = (dispatch) => ({
    AccountActions: bindActionCreators(AccountActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(LoginPage));
