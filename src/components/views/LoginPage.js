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
        AccountActions.reqLoginProcess(AccountProps.get('userId'), AccountProps.get('password'));
    }

    handleChangeValue = name => event => {
        this.props.AccountActions.changeAccountParamData({
          name: name, 
          value: event.target.value
        });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     const { AccountProps : NextAccountProps} = nextProps;
    //     const { AccountProps } = this.props;
    //     return NextAccountProps.get('userToken') !== AccountProps.get('userToken');
    // }

    render() {
        const { classes } = this.props;
        const { AccountProps } = this.props;

        console.log('render1 AccountProps :: ', AccountProps);
        console.log('render2 AccountProps :: ', AccountProps.toJS());
        console.log('render3 AccountProps :: ', AccountProps.toJS().userId);
        console.log('render4 AccountProps :: ', AccountProps.getIn(["userId"]));

        if (AccountProps.get('userToken') !== '') {
            return <Redirect push to ='/Main' />;
        }

        // const userId = AccountProps.get('userId');
        // console.log('render userId :: ', userId);

        return (
            <React.Fragment>
                <div className={classes.homePage}>
                <div>
                    <TextField
                        label="ID"
                        value={AccountProps.get('userId')}
                        className={classes.textField}
                        onChange={this.handleChangeValue('userId')}
                        margin="normal"
                    />
                </div>
                <div>
                    <TextField
                        label="Password"
                        value={AccountProps.get('password')}
                        className={classes.textField}
                        onChange={this.handleChangeValue('password')}
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                    />
                </div>
                <div className={classes.rcMainTitle}>
                    <Button className={classes.RCSmallButton}
                        variant="contained" color="primary"
                        onClick={this.handleLoginBtnClick} >
                        login
                    </Button>
                </div>
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
