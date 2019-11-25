import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GlobalActions from 'modules/GlobalModule';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

class RCDialogConfirm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showOk: true
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(!prevState.showOk) {
      this.setState({
        showOk: true
      });
    }
  }

  handleCancel = () => {
    const { GlobalActions, GlobalProps } = this.props;
    GlobalProps.get('handleConfirmResult')(false);
    GlobalActions.closeConfirm({
      confirmResult: false,
      confirmOpen: false,
      confirmObject: GlobalProps.get('confirmObject')
    });
  };

  handleOk = () => {
    this.setState({
      showOk: false
    });
    const { GlobalActions, GlobalProps } = this.props;
    GlobalProps.get('handleConfirmResult')(true, GlobalProps.get('confirmObject'));
    GlobalActions.closeConfirm({
      confirmResult: true,
      confirmOpen: false,
      confirmObject: GlobalProps.get('confirmObject')
    });
  };

  render() {
    const { classes, GlobalProps } = this.props;
    const showOk = this.state.showOk;

    return (
       <Dialog
          onClose={this.handleCancel}
          open={GlobalProps.get('confirmOpen')}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{GlobalProps.get('confirmTitle')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {GlobalProps.get('confirmMsg')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {showOk && <Button onClick={this.handleOk} color="primary" className={classes.RCSmallButton} variant="contained" style={{marginRight: 20}}>예</Button>}
            <Button onClick={this.handleCancel} color="primary" className={classes.RCSmallButton} variant="contained" autoFocus>아니오</Button>
          </DialogActions>
        </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(RCDialogConfirm));
