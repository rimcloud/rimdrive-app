import React, { Component } from "react";
import { Map } from 'immutable';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';
import * as DeptUserActions from 'modules/DeptUserModule';

import DeptTreeComp from 'components/parts/DeptTreeComp';
import UserListComp from 'components/parts/UserListComp';

import FileListComp from 'components/parts/FileListComp';
import FolderTreeComp from 'components/parts/FolderTreeComp';
import FileOrFolderView from 'components/parts/FileOrFolderView';

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
      shareStep: 1
    };
  }

  componentDidMount() {
    console.log('>>> ShareConfDialog :::  componentDidMount............');
  }

  handleClose = () => {
    this.props.onDialogClose();
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

  handleShareStepNext = () => {
    this.setState({
      shareStep: 2
    })
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
    const { DeptUserActions } = this.props;
    DeptUserActions.setDeptForShare({
      selectedDept: Map({
        deptCd: dept.get('deptCd'),
        deptNm: dept.get('deptNm')
      }),
      isChecked: e.target.checked
    });
  }

  handleSelectUser = (user) => {
    const { DeptUserActions } = this.props;
    // DeptUserActions.showUserInfo({
    //   selectedUser: user
    // });
  }

  handleChangeUserCheck = (e, user) => {
    const { DeptUserActions } = this.props;
    DeptUserActions.setUserForShare({
      selectedUser: Map({
        empId: user.get('empId'),
        empNm: user.get('empNm')
      }),
      isChecked: e.target.checked
    });
  }

  render() {
    const { classes, dialogOpen } = this.props;
    const { DeptUserProps, FileProps } = this.props;

    // console.log('DeptUserProps ::::: ', DeptUserProps.get('deptList'));
    let stepInfo = '';
    if(this.state.shareStep === 1) {
      stepInfo = '공유할 폴더 또는 파일을 선택 후 폴더공유/파일공유 버튼을 클릭하세요.';
    } else if(this.state.shareStep === 2) {
      stepInfo = '선택한 폴더 또는 파일을 공유할 조직 또는 사용자를 선택한 후 공유저장 버튼을 클릭하세요.';
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
        <Typography edge="start" variant="caption" style={{color: 'red', padding: '4px 0px 4px 12px', fontWeight: 'bold', textAlign: 'right'}}>{stepInfo}</Typography>
        <Divider />
        {(this.state.shareStep === 2) &&
          <Grid container style={{ margin: 0 }}>
            <Grid item xs={12} style={{ padding: 10 }}>
              <Grid container style={{ margin: 0 }}>
                <Grid item xs={12}>
                  <FileOrFolderView selectedItem={FileProps.get('selectedItem')} onShareStepBack={this.handleShareStepBack} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} >
              <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef' }}>
                <DeptTreeComp deptList={DeptUserProps.get('deptList')} 
                  shareDepts={DeptUserProps.get('shareDepts')}
                  onSelectDept={this.handleSelectDept}
                  onChangeDeptCheck={this.handleChangeDeptCheck}
                />
              </Box>
            </Grid>
            <Grid item xs={6} >
              <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef', overflow: 'auto' }}>
                <UserListComp 
                  userListData={DeptUserProps.get('userListData')}
                  shareUsers={DeptUserProps.get('shareUsers')}
                  onSelectUser={this.handleSelectUser}
                  onChangeUserCheck={this.handleChangeUserCheck}
                />
              </Box>
            </Grid>
          </Grid>
        }
        {(this.state.shareStep === 1) &&
          <Grid container style={{ margin: 0 }}>
            <Grid item xs={6}>
              <Box style={{ height: 200, margin: 4, padding: 4, backgroundColor: '#efefef' }}>
                <FolderTreeComp folderList={FileProps.get('folderList')} onSelectFolder={this.handleSelectItem} />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box style={{ height: 200, margin: 4, padding: 0, backgroundColor: '#efefef', overflow: 'auto' }}>
                <FileListComp onSelectFile={this.handleSelectItem} />
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
      </Dialog>

    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule,
  DeptUserProps: state.DeptUserModule,
  FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  DeptUserActions: bindActionCreators(DeptUserActions, dispatch),
  FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(ShareConfDialog));
