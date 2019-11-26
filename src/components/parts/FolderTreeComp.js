import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FileActions from 'modules/FileModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import SvgIcon from '@material-ui/core/SvgIcon';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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

  getTreeItemMap = (folderList, fileId) => {
    const folder = folderList.find(e => (e.get('fileId') === fileId));
    let item = null;
    if(folder.get('children').size > 0) {
      item = <TreeItem key={fileId}
              nodeId={fileId.toString()} label={folder.get('name')}
              onClick={() => this.props.onSelectFolder({
                type: 'D',
                id: fileId,
                name: folder.get('name'),
                path: folder.get('path')
              })}
              >
              {(folder.get('children').size > 0) ?
                folder.get('children').map((e) => {
                  return this.getTreeItemMap(folderList, e);
                }) : <div></div>}
              </TreeItem>;
    } else {
      item = <TreeItem key={fileId}
        nodeId={fileId.toString()} label={folder.get('name')}
        onClick={() => this.props.onSelectFolder({
          type: 'D',
          id: fileId,
          name: folder.get('name'),
          path: folder.get('path')
        })}
        />
    }
    return item;
  }

  render() {
    const { classes, folderList, hasTitle } = this.props;

    let folderTree = null;
    if(folderList !== undefined) {
      folderTree = this.getTreeItemMap(folderList, folderList.getIn([0, 'fileId']), 1);
    }

    return (
      <div>
      {(folderTree && hasTitle) && 
        <Card elevation={0} square={true}>
          <RCContentCardHeader title="폴더" subheader=""/>
          <CardContent>
            <TreeView
              className={classes.shareFilesCard}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              defaultEndIcon={<ItemCircle />}
              onNodeToggle={this.handleNodeToggle}
            >
              {folderTree}
            </TreeView>
          </CardContent>
        </Card>
      }
      {(folderTree && !hasTitle) && 
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
