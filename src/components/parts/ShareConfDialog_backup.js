import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as DeptUserActions from 'modules/DeptUserModule';

import DeptTreeComp from 'components/parts/DeptTreeComp';
import UserListComp from 'components/parts/UserListComp';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Dialog from '@material-ui/core/Dialog';

import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ShareConfDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    };
  }

  componentDidMount() {
    console.log('>>> ShareConfDialog :::  componentDidMount............');
  }


  handleClose = () => {
    this.props.onDialogClose();
  }


  render() {
    const { classes, dialogOpen } = this.props;
    const { DeptUserProps } = this.props;

    // console.log('DeptUserProps ::::: ', DeptUserProps.get('deptList'));

    return (
      <Dialog fullScreen open={dialogOpen} onClose={this.handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.shareAppBar}>
          <Toolbar className={classes.shareToolbar}>
              <Typography edge="start" variant="h6" className={classes.shareTitle}>공유 설정</Typography>
              <Button color="primary" variant="contained" className={classes.RCSmallButton} onClick={this.handleClose}>저장</Button>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="close">
                  <CloseIcon />
              </IconButton>
          </Toolbar>
      </AppBar>
      <Grid container style={{ margin: 0 }}>
          <Grid item xs={6} >
              <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef' }}>
                  <DeptTreeComp deptList={DeptUserProps.get('deptList')} />
              </Box>
          </Grid>
          <Grid item xs={6} >
              <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef', overflow: 'auto' }}>
                  <UserListComp />
              </Box>
          </Grid>
      </Grid>
      <Divider />
      <div>선택된 조직 또는 사용자를 표시한다.</div>
  </Dialog>

    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule,
  DeptUserProps: state.DeptUserModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  DeptUserActions: bindActionCreators(DeptUserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(ShareConfDialog));
