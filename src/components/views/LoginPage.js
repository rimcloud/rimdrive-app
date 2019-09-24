import React, { Component } from "react";
import { Redirect } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountActions from 'modules/AccountModule';

import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

class LoginPage extends Component {

    handleLoginBtnClick = (e) => {
        const { AccountActions, AccountProps } = this.props;
        console.log('AccountProps ::: ', (AccountProps) ? AccountProps.toJS() : '--');
        AccountActions.reqLoginProcess(AccountProps.get('id'), AccountProps.get('password'));
    }

    handleChangeValue = name => event => {
        this.props.AccountActions.changeAccountParamData({
          name: name, 
          value: event.target.value
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { AccountProps : NextAccountProps} = nextProps;
        const { AccountProps } = this.props;
        return NextAccountProps.get('userToken') !== AccountProps.get('userToken');

    }

    render() {
        console.log('LOGIN render...........................................');

        const { classes } = this.props;
        const { AccountProps } = this.props;

        if (AccountProps.get('userToken') !== '') {
            return <Redirect push to ='/Main' />;
        }

        return (
            <React.Fragment>
                <div>
                    <TextField
                        id="user-id"
                        label="ID"
                        className={classes.textField}
                        onChange={this.handleChangeValue('id')}
                        margin="normal"
                    />
                </div>
                <div>
                    <TextField
                        id="user-password"
                        label="Password"
                        className={classes.textField}
                        onChange={this.handleChangeValue('password')}
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                    />
                </div>
                <div className={classes.rcMainTitle}>
                    <Button className={classes.GRIconSmallButton}
                        variant="contained" color="primary"
                        onClick={this.handleLoginBtnClick} >
                        login
                </Button>
                </div>
            </React.Fragment>
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
