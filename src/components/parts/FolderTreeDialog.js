import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GlobalActions from 'modules/GlobalModule';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

class FolderTreeDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      folderPath: ''
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
    this.props.onSelectFolder(this.state.folderPath);
  }

  handleNodeToggle = (id, extend) => {
    // console.log('id :: ', id);
    // console.log('extend :: ', extend);
  }

  handleClose = () => {
    this.props.onClose();
  }

  render() {
    const { open = false } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth={true}>
        <DialogTitle id="form-dialog-title" disableTypography={true}
          style={{ padding: 4, fontSize: '12px', color: 'black', background: 'linear-gradient(45deg, #A3A3A2 30%, #2c387b 90%)', fontWeight: 'bolder' }}
        >폴더선택</DialogTitle>
        <DialogContent>
        TreeView
        </DialogContent>
        <DialogActions>
          <Grid container spacing={0}>
            <Grid item xs={6} style={{ paddingTop: '25px' }}>
              <Typography variant="caption" component="p">폴더를 선택후 '선택' 버튼을 누르세요.</Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <Button onClick={this.handleSaveData} color="primary">선택</Button>
              <Button onClick={this.handleClose} color="primary">닫기</Button>
            </Grid>
          </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(FolderTreeDialog));
