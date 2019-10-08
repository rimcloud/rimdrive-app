import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { requestPostAPI, requestGetAPI } from 'components/utils/RCRequester';


import https from 'https';
import axios, { post, get } from 'axios';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FileActions from 'modules/FileModule';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const BASE_URL = "https://gpms.gooroom.kr/gpms/login";
// Init instance of axios which works with BASE_URL
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  baseURL: BASE_URL
});



const createSession = async () => {

  console.log("create session");

  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const authParams = {
    userId: "admins",
    userPw: "224de469ac2cdb434d225ffa2aece72c6e793a100be5b3da98570b4b17f29110",
    httpsAgent: agent
  };


  const resp = await axios.get(BASE_URL, { httpsAgent: agent });

  // const resp = await axios.post(BASE_URL, authParams);

  const cookie = resp.headers["set-cookie"][0]; // get cookie from request

  console.log("cookie :: ", cookie);

  axiosInstance.defaults.headers.Cookie = cookie;   // attach cookie to axiosInstance for future requests

};

// ----------------------------------------

const getBreeds = async () => {
  try {
    return await axios.get('http://localhost:3000/temp/test-api.html');
  } catch (error) {
    console.error(error);
  }
};

const countBreeds = async () => {
  const breeds = await getBreeds();

  if (breeds.data) {
    console.log(`data :: ${breeds.data}`);
  } else {
    console.log(`data is null`);
  }
};


// ----------------------------------------



class FileAndFolderView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    };
  }

  handleShareObj = () => {
    this.props.onOpenShare();
  }


  handleTest = () => {
    console.log("handleTest...");

    // send Post request to https://stackoverflow.com/protected after create session 
    // createSession().then(() => {
    //   axiosInstance.post('/protected') // with new cookie
    // });


    // countBreeds();


    requestGetAPI('temp/test-api.html', {
      grpId: 'grpId'
    }).then(
      (response) => {

        console.log('response :::: ', response);

      }
    ).catch(error => {

      console.log('error : ', error);

    });

  }

  render() {
    const { classes } = this.props;
    const { FileProps } = this.props;

    const selectedFolder = FileProps.get('selectedFolder');
    const selectedFile = FileProps.get('selectedFile');

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
              <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.handleShareObj}>파일공유</Button>
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
            <Grid item xs={6}>
              <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.handleTest}>테스트</Button>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <Button className={classes.RCSmallButton} variant="contained" color="primary" onClick={this.handleShareObj}>폴더공유</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(FileAndFolderView));
