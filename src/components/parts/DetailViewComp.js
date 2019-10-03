import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FileActions from 'modules/FileModule';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class DetailViewComp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    };
  }

  handleSelectFile = (file) => {
    //const treeNode = e.target.parentElement.parentElement;
    // show file info
    console.log('handleSelectFile.... ', file.get('fileName'));
    //this.props.FileActions.showFolderInfo();
  }

  handleShareObj = () => {
    console.log('handleShareObj');
  }

  render() {
    const { classes } = this.props;
    const { FileProps } = this.props;

    const selectedfile = FileProps.get('selectedfile');

    return (
      <div>
        {(selectedfile) &&
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" >파일이름: {selectedfile.get('fileName')}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" >파일크기: {selectedfile.get('fileSize')}</Typography>
            </Grid>
            <Grid item xs={12} style={{textAlign: 'right'}}>
              <Button onClick={this.handleShareObj} color="primary">공유</Button>
            </Grid>
          </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(DetailViewComp));
