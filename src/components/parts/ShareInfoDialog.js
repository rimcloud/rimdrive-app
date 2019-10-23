import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';
import * as ShareActions from 'modules/ShareModule';

import { compareShareInfo } from 'components/utils/RCCommonUtil';

import ShareListComp from 'components/parts/ShareListComp';
import Typography from '@material-ui/core/Typography';

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

class ShareInfoDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      shareStep: 1
    };
  }

  componentDidMount() {
    console.log('>>> ShareInfoDialog :::  componentDidMount............');
  }

  handleClose = () => {
    //
    const { ShareProps } = this.props;
    // console.log('[ShareInfoDialog] ShareProps =>> ', (ShareProps) ? ShareProps.toJS() : 'none');
    // console.log('[ShareInfoDialog] ShareProps.shareUsers =>> ', (ShareProps) ? ShareProps.getIn(['shareUsers', 0]) : 'none');
    // console.log('COMPARE ##########################################');

    let isChanged = false;
    if(compareShareInfo(ShareProps.get('formerShareDepts'), ShareProps.get('shareDepts'))) {
      isChanged = false;
      if(compareShareInfo(ShareProps.get('formerShareUsers'), ShareProps.get('shareUsers'))) {
        isChanged = false;
      } else {
        isChanged = true;
      }
    } else {
      isChanged = true;
    }

    if(isChanged) {
      this.props.GlobalActions.showConfirm({
        confirmTitle: "공유정보 수정",
        confirmMsg: "공유 정보가 변경되었습니다. 저장하겠습니까?",
        handleConfirmResult: (confirmValue, paramObject) => {
            if(confirmValue) {
              // SAVE
                // const { GlobalProps } = this.props;
                // const driveConfig = GlobalProps.get('driveConfig');
                // driveConfig.get('syncItems')
                // .remove({ no: paramObject })
                // .write();
            } else {
              this.props.onDialogClose();
            }
        },
        confirmObject: null
      });
    } else {
      this.props.onDialogClose();
    }
  }

  handleSelectItem = (selectedItem) => {
    if (selectedItem.type === 'D') {
      this.props.FileActions.showFilesInFolder({
        path: selectedItem.path
      });
    }
    this.props.FileActions.setSelectedItem({
      selectedItem: selectedItem
    });
  }

  handleSaveShareInfo = () => {
    const { FileProps } = this.props;
    const { ShareProps, ShareActions } = this.props;
    // create share data
    console.log('############## SAVE #############');
    console.log('FileProps ::::: ', (FileProps) ? FileProps.toJS() : '--');
    console.log('ShareProps ::::: ', (ShareProps) ? ShareProps.toJS() : '--');

    ShareActions.setShareInfoCreate({
      uid: 'test01',
      fid: FileProps.getIn(['selectedItem', 'id']),
      shareDepts: ShareProps.get('shareDepts'),
      shareUsers: ShareProps.get('shareUsers')
    });
  }

  render() {
    const { classes, dialogOpen } = this.props;
    let stepInfo = '공유한 대상 정보입니다. 권한수정 및 삭제작업후 저장버튼을 클릭하세요.';

    console.log('[ShareInfoDialog] ShareProps =>> ', (this.props.ShareProps) ? this.props.ShareProps.toJS() : 'none');

    return (
      <Dialog fullScreen open={dialogOpen} onClose={this.handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.shareAppBar}>
          <Toolbar className={classes.shareToolbar}>
            <Typography edge="start" variant="h6" className={classes.shareTitle}>공유 정보</Typography>
            {/* <Button color="primary" variant="contained" className={classes.RCSmallButton} onClick={this.handleClose}>저장</Button> */}
            <IconButton color="inherit" onClick={this.handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Divider />
        <Typography edge="start" variant="caption" style={{ color: 'red', padding: '4px 0px 4px 12px', fontWeight: 'bold', textAlign: 'right' }}>{stepInfo}</Typography>
        <Divider />
        <ShareListComp />
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule,
  ShareProps: state.ShareModule,
  FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  ShareActions: bindActionCreators(ShareActions, dispatch),
  FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(ShareInfoDialog));
