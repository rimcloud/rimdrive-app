import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountActions from 'modules/AccountModule';

class SetupPage extends Component {

    handleLoginBtnClick = (e) => {
        const { AccountActions, AccountProps } = this.props;
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
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className={classes.contentPage}>
                <div>
                    환경설정
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SetupPage));
