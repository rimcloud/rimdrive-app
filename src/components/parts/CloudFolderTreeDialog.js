import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';

import FolderTreeComp from 'components/parts/FolderTreeComp';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class CloudFolderTreeDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      folderPath: '',
      selectedItem: null
    };
  }

  handleClick = (e) => {
    const treeNode = e.target.parentElement.parentElement;
    this.setState({
      selectedId: treeNode.getAttribute("id"),
      folderPath: treeNode.getAttribute("path")
    });
  }

  handleSaveData = () => {
    // send selected folder path and dialog close
    this.props.onSelectCloudFolder(this.state.selectedItem);
  }

  handleClose = () => {
    this.props.onClose();
  }

  handleSelectCloudFolder = (selectedItem) => {
    this.setState({
      selectedItem: selectedItem
    });
    // if (selectedItem.type === 'D') {
    //   this.props.FileActions.showFilesInFolder({
    //     path: selectedItem.path
    //   });
    // }
    // this.props.FileActions.setSelectedItem({
    //   selectedItem: selectedItem
    // });
  }

  render() {
    const { classes, FileProps, open = false } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth={true} PaperProps={{square:true}}>
        <DialogTitle id="form-dialog-title" disableTypography={true} style={{background: '#5a5a5a', color: '#ffffff', height: '20px', padding: 4}}
        >폴더선택</DialogTitle>
        <DialogContent>
        <FolderTreeComp folderList={FileProps.get('folderList')} 
          onSelectFolder={this.handleSelectCloudFolder} 
          hasTitle={false}
        />
        </DialogContent>
        <DialogActions>
          <Grid container spacing={3}>
            <Grid item xs={6} style={{ paddingTop: '25px' }}>
              <Typography variant="caption" component="p">폴더를 선택후 '선택' 버튼을 누르세요.</Typography>
            </Grid>
            <Grid item xs={6} style={{ paddingTop: '25px', textAlign: 'right' }}>
              <Button onClick={this.handleSaveData} className={classes.RCSmallButton} style={{marginRight: 20}}
              variant="contained" color="primary"
              >선택</Button>
              <Button onClick={this.handleClose} className={classes.RCSmallButton}
              variant="contained" color="secondary"
              >닫기</Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule,
  FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(CloudFolderTreeDialog));
