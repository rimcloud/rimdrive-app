import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';

import ShareListComp from 'components/parts/ShareListComp';
import FileOrFolderView from 'components/parts/FileOrFolderView';

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
    const { ShareProps } = this.props;

    const selectedItem = (ShareProps.get('shareInfoList') && ShareProps.get('shareInfoList').size > 0) ? ShareProps.getIn(['shareInfoList', 0]).toJS() : null;
    
    let stepInfo = '공유한 폴더/파일과 대상 정보입니다.';

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
        <Grid container spacing={0}>
          <Grid item xs={10} style={{ paddingTop: 4 }}>
            <Typography edge="start" variant="caption" style={{ color: 'red', padding: '4px 0px 4px 12px', fontWeight: 'bold', textAlign: 'left' }}>{stepInfo}</Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right' }}>
            <Button className={classes.RCSmallButton} variant="contained" color="secondary" style={{ margin: '10px' }} onClick={this.props.onClickShareEdit}>수정</Button>
          </Grid>
        </Grid>
        <Divider />
        <Grid container style={{ margin: 0 }}>
          <Grid item xs={12} style={{ margin: 4, padding: 4 }}>
            <FileOrFolderView selectedItem={selectedItem} />
          </Grid>
          <Grid item xs={12} >
            <ShareListComp isEdit={false} />
          </Grid>
        </Grid>
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
