import React, { Component } from "react";
import { Map } from 'immutable';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FileActions from 'modules/FileModule';

import SvgIcon from '@material-ui/core/SvgIcon';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

function ItemCircle(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" {...props}>
      <path fill="#000000" d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
    </SvgIcon>
  );
}

class FolderTreeComp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    };
  }

  handleNodeToggle = (id, extend) => {
    // const { folderList } = this.props;
    // console.log('id :: ', id);
    // console.log('extend :: ', extend);

    // const folder = folderList.find(e => (e.get('folderId') === id));
    // console.log('clicked folder  = ', folder);
    // FileActions.showFolderInfo({
    //   selectedFolder: folder
    // });
  }

  handleSelectFolder = (folderId) => {
    const { folderList, FileActions } = this.props;
    // // show folder info and file list
    const folder = folderList.find(n => (n.get('folderId') === folderId));
    FileActions.showFolderInfo({
      selectedFolder: folder
    });
  }

  getTreeItemMap = (folderList, folderId) => {
    const folder = folderList.find(e => (e.get('folderId') === folderId));
    let item = null;
    if(folder.get('children').size > 0) {
      item = <TreeItem key={folderId}
              nodeId={folderId.toString()} label={folder.get('folderName')}
              onClick={() => this.handleSelectFolder(folderId)}
              >
              {(folder.get('children').size > 0) ?
                folder.get('children').map((e) => {
                  return this.getTreeItemMap(folderList, e);
                }) : <div></div>}
              </TreeItem>;
    } else {
      item = <TreeItem key={folderId}
        nodeId={folderId.toString()} label={folder.get('folderName')}
        onClick={() => this.handleSelectFolder(folderId)}
        />
    }
    return item;
  }

  render() {
    const { classes, folderList } = this.props;
    // console.log('FolderTreeComp-render :: ', (folderList) ? folderList.toJS() : 'nn');

    let folderTree = null;
    if(folderList !== undefined) {
      folderTree = this.getTreeItemMap(folderList, folderList.getIn([0, 'folderId']), 1);
    }
    // console.log('folderTree =========================================== ', folderTree);

    const pathItems = <React.Fragment>
            <TreeItem nodeId='1' label='폴더1' onClick={() => this.handleSelectFolder(Map({folderName:'폴더1',folderId:'folder001'}))}>
                <TreeItem nodeId='2' label='폴더2' onClick={() => this.handleSelectFolder(Map({folderName:'폴더2',folderId:'folder002'}))} ></TreeItem>

                <TreeItem nodeId='3' label='폴더3' onClick={() => this.handleSelectFolder(Map({folderName:'폴더3',folderId:'folder003'}))}>
                  <TreeItem nodeId='31' label='폴더31' onClick={() => this.handleSelectFolder(Map({folderName:'폴더31',folderId:'folder0031'}))} />
                  <TreeItem nodeId='32' label='폴더32' onClick={() => this.handleSelectFolder(Map({folderName:'폴더32',folderId:'folder0032'}))} />
                </TreeItem>
                <TreeItem nodeId='4' label='폴더4' onClick={() => this.handleSelectFolder(Map({folderName:'폴더4',folderId:'folder004'}))} />
                <TreeItem nodeId='5' label='폴더5' onClick={() => this.handleSelectFolder(Map({folderName:'폴더5',folderId:'folder005'}))}>
                    <TreeItem nodeId='6' label='폴더6' onClick={() => this.handleSelectFolder(Map({folderName:'폴더6',folderId:'folder006'}))} />
                    <TreeItem nodeId='7' label='폴더7' onClick={() => this.handleSelectFolder(Map({folderName:'폴더7',folderId:'folder007'}))} />
                </TreeItem>
            </TreeItem>
        </React.Fragment>;

    return (
      <div>
      {(folderTree) && 
        <TreeView
          className={classes.shareFilesCard}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultEndIcon={<ItemCircle />}
          onNodeToggle={this.handleNodeToggle}
        >
          {folderTree}
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
