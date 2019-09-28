import React, { Component } from "react";
import fs from 'fs';

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
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

class FolderTreeDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      folderPath: ''
    };
  }

  componentDidMount() {
    const { GlobalProps } = this.props;
    console.log('FolderTreeDialog : componentDidMount');
  }

      shouldComponentUpdate(nextProps, nextState) {
        const {AccountProps: NextAccountProps} = nextProps;
        const {AccountProps} = this.props;
        return NextAccountProps.get('userToken') !== AccountProps.get('userToken');
    }


  handleClick = (id, path) => {
    console.log('handleClick ================================= :: ', id);
    this.setState({
      selectedId: id,
      folderPath: path
    });
  }

  handleSaveData = () => {
    // send selected folder path and dialog close
    this.props.onSelectFolder(this.state.folderPath);
  }

  handleNodeToggle = (id, extend) => {
    console.log('id :: ', id);
    console.log('extend :: ', extend);
  }

  render() {
    const { classes } = this.props;
    const { open = false, GlobalProps } = this.props;

    console.log('FOLDER TREE RENDER #############################################');

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth={true}>
        <DialogTitle id="form-dialog-title" disableTypography={true}
          style={{ padding: 4, fontSize: '12px', color: 'black', background: 'linear-gradient(45deg, #A3A3A2 30%, #2c387b 90%)', fontWeight: 'bolder' }}
        >폴더선택</DialogTitle>
        <DialogContent>
          <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            onNodeToggle={this.handleNodeToggle}
          >
            <TreeItem nodeId="1" label="1Applications" onClick={() => this.handleClick('1', 'sdfawfwfwef')} >
              <TreeItem nodeId="3" label="3Calendar" onClick={() => this.handleClick('3', 'sdfawfwfwef')} />
              <TreeItem nodeId="4" label="4Chrome" onClick={() => this.handleClick('4', 'sdfawfwfwef')} />
              <TreeItem nodeId="5" label="5Webstorm" onClick={() => this.handleClick('5', 'sdfawfwfwef')} />
            </TreeItem>
            <TreeItem nodeId="2" label="2Documents" onClick={() => this.handleClick('2', 'sdfawfwfwef')} >
              <TreeItem nodeId="6" label="6Material-UI" onClick={() => this.handleClick('6', 'sdfawfwfwef')} >
                <TreeItem nodeId="7" label="7src" onClick={() => this.handleClick('7', 'sdfawfwfwef')} >
                  <TreeItem nodeId="8" label="8index.js" onClick={() => this.handleClick('8', 'sdfawfwfwef')} />
                  <TreeItem nodeId="9" label="9tree-view.js" onClick={() => this.handleClick('9', 'sdfawfwfwef')} />
                </TreeItem>
              </TreeItem>
            </TreeItem>
            <TreeItem nodeId="12" label="2Documents" onClick={() => this.handleClick('12', 'sdfawfwfwef')} >
              <TreeItem nodeId="16" label="6Material-UI" onClick={() => this.handleClick('16', 'sdfawfwfwef')} >
                <TreeItem nodeId="17" label="7src" onClick={() => this.handleClick('17', 'sdfawfwfwef')} >
                  <TreeItem nodeId="18" label="8index.js" onClick={() => this.handleClick('18', 'sdfawfwfwef')} />
                  <TreeItem nodeId="19" label="9tree-view.js" onClick={() => this.handleClick('19', 'sdfawfwfwef')} />
                </TreeItem>
              </TreeItem>
            </TreeItem>

            <TreeItem nodeId="22" label="2Documents" onClick={() => this.handleClick('22', 'sdfawfwfwef')} >
              <TreeItem nodeId="26" label="6Material-UI" onClick={() => this.handleClick('26', 'sdfawfwfwef')} >
                <TreeItem nodeId="27" label="7src" onClick={() => this.handleClick('27', 'sdfawfwfwef')} >
                  <TreeItem nodeId="28" label="8index.js" onClick={() => this.handleClick('28', 'sdfawfwfwef')} />
                  <TreeItem nodeId="29" label="9tree-view.js" onClick={() => this.handleClick('29', 'sdfawfwfwef')} />
                </TreeItem>
              </TreeItem>
            </TreeItem>

            <TreeItem nodeId="32" label="2Documents" onClick={() => this.handleClick('32', 'sdfawfwfwef')} >
              <TreeItem nodeId="36" label="6Material-UI" onClick={() => this.handleClick('36', 'sdfawfwfwef')} >
                <TreeItem nodeId="37" label="7src" onClick={() => this.handleClick('37', 'sdfawfwfwef')} >
                  <TreeItem nodeId="38" label="8index.js" onClick={() => this.handleClick('38', 'sdfawfwfwef')} />
                  <TreeItem nodeId="39" label="9tree-view.js" onClick={() => this.handleClick('39', 'sdfawfwfwef')} />
                </TreeItem>
              </TreeItem>
            </TreeItem>

          </TreeView>

        </DialogContent>
        <DialogActions>
          <Grid container spacing={3}>
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
