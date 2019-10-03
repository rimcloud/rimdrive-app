import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FileActions from 'modules/FileModule';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

class FolderTreeComp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    };
  }

  handleNodeToggle = (id, extend) => {
    // console.log('id :: ', id);
    // console.log('extend :: ', extend);
  }


  handleSelectFolder = (e) => {
    const { FileProps, FileActions } = this.props;

    const treeNode = e.target.parentElement.parentElement;
    // show folder info and file list
    FileActions.showFolderInfo();
  }

  render() {
    const { classes } = this.props;
    const { FileProps } = this.props;

    const pathItems = <React.Fragment>
            <TreeItem nodeId='1' label='폴더1' custom1='1111' custom2='2222'>
                <TreeItem nodeId='2' label='파일1' custom1='2222' custom2='2222' />
                <TreeItem nodeId='3' label='파일2' custom1='3333' custom2='2222' />
                <TreeItem nodeId='4' label='파일3' custom1='4444' custom2='2222' />
                <TreeItem nodeId='5' label='폴더2' custom1='5555' custom2='2222'>
                    <TreeItem nodeId='6' label='파일4' custom1='6666' custom2='2222' />
                    <TreeItem nodeId='7' label='파일5' custom1='7777' custom2='2222' />
                </TreeItem>
            </TreeItem>
        </React.Fragment>;

    return (
      <div>
      {(pathItems) && 
        <TreeView
          className={classes.shareFilesCard}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeToggle={this.handleNodeToggle}
          onClick={this.handleSelectFolder}
        >
          {pathItems}
        </TreeView>
      }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
  FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(FolderTreeComp));
