import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';

import ShareListComp from 'components/parts/ShareListComp';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ShareViewDialog extends Component {

  render() {
    const { classes, dialogOpen } = this.props;
    let stepInfo = '공유한 대상 정보입니다.';

    // console.log('[ShareViewDialog] ShareProps =>> ', (this.props.ShareProps) ? this.props.ShareProps.toJS() : 'none');

    return (
      <Dialog fullScreen open={dialogOpen} onClose={this.props.onDialogClose} TransitionComponent={Transition}>
        <AppBar className={classes.shareAppBar}>
          <Toolbar className={classes.shareToolbar}>
            <Typography edge="start" variant="h6" className={classes.shareTitle}>공유 정보</Typography>
            {/* <Button color="primary" variant="contained" className={classes.RCSmallButton} onClick={this.handleClose}>저장</Button> */}
            <IconButton color="inherit" onClick={this.props.onDialogClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Divider />
        <Grid container spacing={3}>
          <Grid item xs={10} style={{ paddingTop: 20 }}>
            <Typography edge="start" variant="caption" style={{ color: 'red', padding: '4px 0px 4px 12px', fontWeight: 'bold', textAlign: 'left' }}>{stepInfo}</Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right' }}>
            <Button className={classes.RCSmallButton} variant="contained" color="secondary" style={{ margin: '10px' }} onClick={this.props.onClickShareEdit}>수정</Button>
          </Grid>
        </Grid>
        <Divider />
        <ShareListComp isEdit={false} />
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  ShareProps: state.ShareModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(ShareViewDialog));
