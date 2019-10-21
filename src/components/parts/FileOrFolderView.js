import React, { Component } from "react";
import { Map } from 'immutable';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FileActions from 'modules/FileModule';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class FileOrFolderView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    };
  }

  handleShareObj = () => {
    this.props.onOpenShare();
  }


  selectLocalFolder = (pathString, depth) => {
    let dirents = fs.readdirSync(pathString, { withFileTypes: true });
    let innerItems = [];

    dirents.forEach((path, i) => {
      if (path.isDirectory()) {
        innerItems.push(path.name);
        this.selectLocalFolder(`${pathString}/${path.name}`, depth + 1);
      } else {
        innerItems.push(path.name);
      }
    });

    return innerItems;
  }

  handleUploadTest = () => {

// console.log("handleUploadTest... ", __dirname);

    // const ff = fs.readFileSync(__dirname + 'flower.jpg');
    // console.log('FF :::::: ', ff);

    // fs.readdir(__dirname, function(error, filelist){
    //   console.log(filelist);
    // })

    const flowerFile = fs.readFileSync('/flower.jpg');

// console.log('flowerFile ::: ', flowerFile.length);

    const form = new FormData();
    const stream = fs.createReadStream('/flower.jpg');
    form.append('method', 'UPLOAD');
    form.append('userid', 'test01');
    form.append('path', encodeURI('/개인저장소/모든파일/test1/flower.jpg'));
    form.append('file', flowerFile);

    // form.append('my_file', fs.createReadStream('/foo/bar.jpg'), 'bar.jpg' );
    // form.append( 'my_file', fs.createReadStream('/flower.jpg'), {filename: 'flower.jpg', contentType: 'image/jpeg', knownLength: 9568} );
    // form.append('file', ff, 'flower.jpg');


    const url = 'http://demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros';
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    axios.post(url, form, config).then(response => {
// console.log(response);
    }).catch(error => {
      if (error.response) {
// console.log(error.response);
      }
// console.log(error.message);
    });

  }

  render() {
    const { classes } = this.props;
    const { FileProps } = this.props;

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
        {(selectedFile) &&
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" >파일이름: {selectedFile.get('fileName')}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" >파일크기: {selectedFile.get('fileSize')}</Typography>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
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
            <Grid item xs={6}>
              <Typography variant="subtitle2" >폴더이름: {selectedFolder.get('folderName')}</Typography>
            </Grid>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              {(this.props.onShareStepNext) &&
                <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.props.onShareStepNext}>폴더공유</Button>
              }
              {(this.props.onShareStepBack) &&
                <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.props.onShareStepBack}>선택취소</Button>
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(FileOrFolderView));
