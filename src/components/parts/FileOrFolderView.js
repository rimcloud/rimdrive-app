import React, { Component } from "react";
import { Map } from 'immutable';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FileActions from 'modules/FileModule';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class FileOrFolderView extends Component {

  render() {
    const { classes } = this.props;
    const { FileProps, selectedItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let selectedFolder = null;
    let selectedFile = null;

    const selectedObject = (selectedItem) ? selectedItem : FileProps.get('selectedItem');

    if (selectedObject) {
      if (selectedObject.type === 'D') {
        selectedFolder = Map({
          folderName: selectedObject.name,
          folderPath: selectedObject.path
        });
      } else if (selectedObject.type === 'F') {
        selectedFile = Map({
          fileName: selectedObject.name,
          fileSize: selectedObject.size
        });
      }
    }

    return (
      <div>
        {(selectedFile) &&
          <Card elevation={0} style={{backgroundColor:'#efefef'}}>
          <RCContentCardHeader title="공유 파일" subheader=""/>
          <CardContent>          
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
          </CardContent>
          </Card>
        }
        {(selectedFolder) &&
          <Card elevation={0} style={{backgroundColor:'#efefef'}}>
          <RCContentCardHeader title="공유 폴더" subheader=""/>
          <CardContent>          
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
          </CardContent>
          </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(FileOrFolderView));
