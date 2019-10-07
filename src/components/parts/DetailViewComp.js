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

  handleShareObj = () => {
    this.props.onOpenShare();
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
            <Grid item xs={12} style={{textAlign: 'right'}}>
              <Button onClick={this.handleShareObj} color="primary">공유</Button>
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
            <Grid item xs={12} style={{textAlign: 'right'}}>
              <Button className={classes.RCSmallButton}
                variant="contained" color="primary"
                onClick={this.handleShareObj}>공유</Button>
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
