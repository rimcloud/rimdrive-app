import React, { Component } from "react";
import { Map } from 'immutable';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';
import * as DeptUserActions from 'modules/DeptUserModule';
import * as ShareActions from 'modules/ShareModule';

import DeptTreeComp from 'components/parts/DeptTreeComp';
import UserListComp from 'components/parts/UserListComp';

import FileListComp from 'components/parts/FileListComp';
import FolderTreeComp from 'components/parts/FolderTreeComp';
import FileOrFolderView from 'components/parts/FileOrFolderView';
import ShareListComp from 'components/parts/ShareListComp';

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
      selectedId: '',
      shareStep: 1,
      actType: 'CREATE'
    };
  }

  handleClose = () => {
    this.setState({
      shareStep: 1
    });
    this.props.FileActions.setSelectedItem({
      selectedItem: null
    });
    
    this.props.onDialogClose();
  }

  handleSelectFolderFile = (selectedItem) => {
    if (selectedItem.type === 'D') {
      this.props.FileActions.showFilesInFolder({
        path: selectedItem.path
      });
    }
    this.props.FileActions.setSelectedItem({
      selectedItem: selectedItem
    });
  }

  handleShareStepNext = () => {
    // get before share info by selected folder or file
    const { ShareActions, FileProps } = this.props;
    ShareActions.getShareInfo({
      sid: 'test01',
      fid: FileProps.getIn(['selectedItem', 'id'])
    }).then((res) => {

      // console.log('handleShareStepNext res ::: ', res);
      if (res.status && res.status.result === 'SUCCESS') {
        if (res.data) {
          this.setState({ shareStep: 2, actType: 'UPDATE' });
        } else {
          this.setState({ shareStep: 2, actType: 'CREATE' });
        }
      }
    });
  }

  handleShareStepBack = () => {
    this.setState({
      shareStep: 1
    })
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

  handleDeleteFromShare = (group, id) => {
    const { ShareActions } = this.props;
    ShareActions.deleteItemForShare({
      group: group,
      id: id
    });
  }

  handleChangePermission = (group, id, value) => {
    const { ShareActions } = this.props;
    ShareActions.changePermission({
      group: group,
      id: id,
      value: value
    });
  }

  handleShareInfoSave = () => {
    const { FileProps } = this.props;
    const { ShareProps, ShareActions } = this.props;

    if (this.state.actType === 'CREATE') {
      // create share data
      ShareActions.setShareInfoCreate({
        uid: 'test01',
        fid: FileProps.getIn(['selectedItem', 'id']),
        shareDepts: ShareProps.get('shareDepts'),
        shareUsers: ShareProps.get('shareUsers')
      }).then((res) => {
        // get share info
        if (res.status) {
          if (res.status.result === 'SUCCESS') {
            alert('공유정보가 생성되었습니다.');
          } else if (res.status.result === 'FAIL') {
            alert(res.status.message);
          }
        } else {
          alert('공유정보 생성중 오류가 발생하였습니다.');
        }
      });
    } else if (this.state.actType === 'UPDATE') {
      // update share data
      ShareActions.setShareInfoUpdate({
        uid: 'test01',
        shid: ShareProps.getIn(['shareInfo', 'shareId']),
        shareDepts: ShareProps.get('shareDepts'),
        shareUsers: ShareProps.get('shareUsers'),
        formerShareDepts: ShareProps.get('formerShareDepts'),
        formerShareUsers: ShareProps.get('formerShareUsers'),
      }).then((res) => {
        // get share info
        if (res.status) {
          if (res.status.result === 'SUCCESS') {
            alert('공유정보가 수정되었습니다.');
          } else if (res.status.result === 'FAIL') {
            alert(res.status.message);
          }
        } else {
          alert('공유정보 수정중 오류가 발생하였습니다.');
        }
      });
    }
  }

  render() {
    const { classes, dialogOpen } = this.props;
    const { DeptUserProps, FileProps, ShareProps } = this.props;

    let stepInfo = '';
    if (this.state.shareStep === 1) {
      stepInfo = '공유할 폴더 또는 파일을 선택 후 폴더공유/파일공유 버튼을 클릭하세요.';
    } else if (this.state.shareStep === 2) {
      stepInfo = '공유할 조직 또는 사용자를 선택한 후 저장 버튼을 클릭하세요.';
    }    

    return (
      <Dialog fullScreen open={dialogOpen} onClose={this.handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.shareAppBar}>
          <Toolbar className={classes.shareToolbar}>
            <Typography edge="start" variant="h6" className={classes.shareTitle}>공유 설정</Typography>
            {/* <Button color="primary" variant="contained" className={classes.RCSmallButton} onClick={this.handleClose}>저장</Button> */}
            <IconButton color="inherit" onClick={this.handleClose} aria-label="close">
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
            {(this.state.shareStep === 2) &&
            <Button className={classes.RCSmallButton} variant="contained" color="secondary" style={{ margin: '10px' }} onClick={() => this.props.onShareInfoSave(this.state.actType)}>저장</Button>
            }
          </Grid>
        </Grid>

        <Divider />
        {(this.state.shareStep === 1) &&
          <Grid container style={{ margin: 0 }}>
            <Grid item xs={6}>
              <Box style={{ height: 300, margin: '10px 5px 10px 10px', padding: 0, backgroundColor: '#efefef', overflow: 'auto' }}>
                <FolderTreeComp folderList={FileProps.get('folderList')} 
                  onSelectFolder={this.handleSelectFolderFile} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box style={{ height: 300, margin: '10px 10px 10px 5px', padding: 0, backgroundColor: '#efefef', overflow: 'auto' }}>
                <FileListComp onSelectFile={this.handleSelectFolderFile} />
              </Box>
            </Grid>
            <Grid item xs={12} style={{ padding: 10 }}>
              <Grid container style={{ margin: 0 }}>
                <Grid item xs={12}>
                  <FileOrFolderView selectedItem={FileProps.get('selectedItem')} onShareStepNext={this.handleShareStepNext} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
        {(this.state.shareStep === 2) &&
          <div>
            <Grid container style={{ margin: 0 }}>
              <Grid item xs={12} style={{ padding: 10 }}>
                <Grid container style={{ margin: 0 }}>
                  <Grid item xs={12}>
                    <FileOrFolderView selectedItem={FileProps.get('selectedItem')} onShareStepBack={this.handleShareStepBack} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} >
                <Box style={{ height: 300, margin: '10px 5px 10px 10px', padding: 0, backgroundColor: '#efefef', overflow: 'auto' }}>
                  <DeptTreeComp deptList={DeptUserProps.get('deptList')}
                    shareDepts={ShareProps.get('shareDepts')}
                    onSelectDept={this.handleSelectDept}
                    onChangeDeptCheck={this.handleChangeDeptCheck}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} >
                <Box style={{ height: 300, margin: '10px 10px 10px 5px', padding: 0, backgroundColor: '#efefef', overflow: 'auto' }}>
                  <UserListComp
                    userListData={DeptUserProps.get('userListData')}
                    shareUsers={ShareProps.get('shareUsers')}
                    onSelectUser={this.handleSelectUser}
                    onChangeUserCheck={this.handleChangeUserCheck}
                  />
                </Box>
              </Grid>
            </Grid>
            <ShareListComp isEdit={true} />
          </div>
        }
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule,
  DeptUserProps: state.DeptUserModule,
  ShareProps: state.ShareModule,
  FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  DeptUserActions: bindActionCreators(DeptUserActions, dispatch),
  ShareActions: bindActionCreators(ShareActions, dispatch),
  FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(ShareConfDialog));
