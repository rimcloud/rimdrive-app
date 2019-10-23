import React, { Component } from "react";
import { Map } from 'immutable';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FileActions from 'modules/FileModule';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class FileOrFolderView extends Component {

  render() {
    const { classes } = this.props;
    const { FileProps } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let selectedFolder = null;
    let selectedFile = null;
    const selectedItem = FileProps.get('selectedItem');

    if (selectedItem) {
      if (selectedItem.type === 'D') {
        selectedFolder = Map({
          folderName: selectedItem.name,
          folderPath: selectedItem.path
        });
      } else if (selectedItem.type === 'F') {
        selectedFile = Map({
          fileName: selectedItem.name,
          fileSize: selectedItem.size
        });
      }
    }

    return (
      <div>
        <Paper style={{ padding:10, backgroundColor: 'rgba(69, 100, 92, 0.18)' }}>
        {(selectedFile) &&
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Typography variant="subtitle2" >{bull} 파일이름: {selectedFile.get('fileName')}</Typography>
              <Typography variant="subtitle2" >{bull} 파일크기: {selectedFile.get('fileSize')}</Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              {(this.props.onShareStepNext) &&
                <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.props.onShareStepNext}>파일공유</Button>
              }
              {(this.props.onShareStepBack) &&
                <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.props.onShareStepBack}>선택취소</Button>
              }
            </Grid>
          </Grid>
        }
        {(selectedFolder) &&
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Typography variant="subtitle2" >{bull} 폴더이름: {selectedFolder.get('folderName')}</Typography>
              <Typography variant="subtitle2" >{bull} 경로: {selectedFolder.get('folderPath')}</Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              {(this.props.onShareStepNext) &&
                <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.props.onShareStepNext}>폴더공유</Button>
              }
              {(this.props.onShareStepBack) &&
                <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.props.onShareStepBack}>선택취소</Button>
              }
            </Grid>
          </Grid>
        }
        </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(FileOrFolderView));
