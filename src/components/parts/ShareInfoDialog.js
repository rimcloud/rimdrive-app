import React, { Component } from "react";
import { Map } from 'immutable';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as DeptUserActions from 'modules/DeptUserModule';
import * as ShareActions from 'modules/ShareModule';

import DeptTreeComp from 'components/parts/DeptTreeComp';
import UserListComp from 'components/parts/UserListComp';
import FileOrFolderView from 'components/parts/FileOrFolderView';

import { compareShareInfo } from 'components/utils/RCCommonUtil';

import ShareListComp from 'components/parts/ShareListComp';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
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

  handleClose = () => {
    const { ShareProps } = this.props;

    let isChanged = false;
    if (compareShareInfo(ShareProps.get('formerShareDepts'), ShareProps.get('shareDepts'))) {
      if (compareShareInfo(ShareProps.get('formerShareUsers'), ShareProps.get('shareUsers'))) {
        isChanged = false;
      } else {
        isChanged = true;
      }
    } else {
      isChanged = true;
    }

    this.props.DeptUserActions.setUserListEmpty();

    if (isChanged) {
      this.props.GlobalActions.showConfirm({
        confirmTitle: "공유정보 수정",
        confirmMsg: "공유 정보가 변경되었습니다. 저장하겠습니까?",
        handleConfirmResult: (confirmValue, paramObject) => {
          if (confirmValue) {
            this.props.onShareInfoSave('UPDATE');
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
        userId: this.props.AccountProps.get('userId'),
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
    ShareActions.setShareInfoCreate({
      userId: this.props.AccountProps.get('userId'),
      fileId: FileProps.getIn(['selectedItem', 'id']),
      shareDepts: ShareProps.get('shareDepts'),
      shareUsers: ShareProps.get('shareUsers')
    });
  }

  handleSelectDept = (dept) => {
    const { DeptUserActions } = this.props;
    // show dept info and user list
    DeptUserActions.getUserList({
      selectedDeptCd: dept
    });

    DeptUserActions.showDeptInfo({
      selectedDeptCd: dept
    });
  }

  handleChangeDeptCheck = (e, dept) => {
    const { ShareActions } = this.props;
    ShareActions.addDeptForShare({
      selectedDept: Map({
        'shareTargetNo': '',
        'shareId': '',
        'targetTp': 'D',
        'shareWithName': dept.get('deptNm'),
        'shareWithUid': dept.get('deptCd'),
        'permissions': 'R'
      }),
      isChecked: e.target.checked
    });
  }

  handleSelectUser = (user) => {
    // const { DeptUserActions } = this.props;
    // DeptUserActions.showUserInfo({
    //   selectedUser: user
    // });
  }

  handleChangeUserCheck = (e, user) => {
    const { ShareActions } = this.props;
    ShareActions.addUserForShare({
      selectedUser: Map({
        'shareTargetNo': '',
        'shareId': '',
        'targetTp': 'U',
        'shareWithName': user.get('empNm'),
        'shareWithUid': user.get('empId'),
        'permissions': 'R'
      }),
      isChecked: e.target.checked
    });
  }

  render() {
    const { classes, dialogOpen } = this.props;
    const { DeptUserProps, ShareProps } = this.props;

    const selectedItem = (ShareProps.get('shareInfoList') && ShareProps.get('shareInfoList').size > 0) ? ShareProps.getIn(['shareInfoList', 0]).toJS() : null;
    const stepInfo = '수정 또는 삭제 하실 수 있습니다.';

    return (
      <Dialog fullScreen open={dialogOpen} onClose={this.handleClose} TransitionComponent={Transition} style={{margin: 20}}>
        <AppBar className={classes.shareAppBar}>
          <Toolbar className={classes.shareToolbar}>
            <Typography edge="start" variant="h6" className={classes.shareTitle}>공유 정보 수정</Typography>
            <IconButton color="inherit" onClick={this.handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Divider />
        <Grid container spacing={0}>
          <Grid item xs={6} style={{ paddingTop: 4 }}>
            <Typography edge="start" variant="caption" style={{ color: 'red', padding: '4px 0px 4px 12px', fontWeight: 'bold', textAlign: 'left' }}>{stepInfo}</Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Button className={classes.RCSmallButton} variant="contained" color="secondary" style={{ margin: '10px' }} onClick={() => this.props.onShareInfoSave('UPDATE')}>저장</Button>
          <Button className={classes.RCSmallButton} variant="contained" color="primary" style={{ margin: '10px' }} onClick={() => this.props.onShareInfoDelete()}>삭제</Button>
          </Grid>
        </Grid>
        <Divider />
        <Paper style={{overflow: 'auto'}}>
          <Grid container style={{ margin: 0 }}>
            <Grid item xs={12} style={{ margin: 4, padding: 4 }}>
              <FileOrFolderView selectedItem={selectedItem} />
            </Grid>
            <Grid item xs={6} >
              <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef' }}>
                <DeptTreeComp deptList={DeptUserProps.get('deptList')}
                  shareDepts={ShareProps.get('shareDepts')}
                  onSelectDept={this.handleSelectDept}
                  onChangeDeptCheck={this.handleChangeDeptCheck}
                />
              </Box>
            </Grid>
            <Grid item xs={6} >
              <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef', overflow: 'auto' }}>
                <UserListComp
                  userListData={DeptUserProps.get('userListData')}
                  shareUsers={ShareProps.get('shareUsers')}
                  onSelectUser={this.handleSelectUser}
                  onChangeUserCheck={this.handleChangeUserCheck}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <ShareListComp isEdit={true} />
            </Grid>
          </Grid>
        </Paper>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule,
  AccountProps: state.AccountModule,
  ShareProps: state.ShareModule,
  DeptUserProps: state.DeptUserModule,
  FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  ShareActions: bindActionCreators(ShareActions, dispatch),
  DeptUserActions: bindActionCreators(DeptUserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(ShareInfoDialog));
