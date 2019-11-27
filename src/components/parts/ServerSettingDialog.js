import React, { Component } from "react";

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import log from 'electron-log';

import * as GlobalActions from 'modules/GlobalModule';
import * as FileActions from 'modules/FileModule';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const CustomCssRadio = withStyles({
  root: {
    "& .MuiRadio-colorSecondary.Mui-checked ": {
      color: "red"
    }
  }
})(Radio);


const CustomCssFormControlLabel = withStyles({
  root: {
    "& .MuiFormLabel-root.Mui-focused ": {
      color: "red"
    },
    "& .MuiInput-underline:before ": {
      color: "gray",
      borderBottom: "2px solid gray"
    },
    "& .MuiInput-underline:after ": {
      color: "red",
      borderBottom: "2px solid red"
    }
  }
})(FormControlLabel);

class ServerSettingDialog extends Component {

  constructor(props) {
    super(props);

    const driveConfig = props.GlobalProps.get('driveConfig');
    this.state = {
      protocol: (driveConfig) ? driveConfig.get('serverConfig.protocol').value() : '',
      hostname: (driveConfig) ? driveConfig.get('serverConfig.hostname').value() : '',
      port: (driveConfig) ? driveConfig.get('serverConfig.port').value() : ''
    };
  }

  handleSaveData = () => {
    // send selected folder path and dialog close
    // log.debug('protocol -> ', this.state.protocol);
    // log.debug('hostname -> ', this.state.hostname);
    // log.debug('port -> ', this.state.port);

    const param = {
      protocol: this.state.protocol,
      hostname: this.state.hostname,
      port: this.state.port
    };

    const { GlobalProps, GlobalActions } = this.props;
    const driveConfig = GlobalProps.get('driveConfig');

    driveConfig.get('serverConfig').assign(param).write();
    GlobalActions.setServerConfig(param).then(() => {
      alert('서버 정보가 저장되었습니다.');
    }).catch((error) => {
      alert(`[오류] : ${error}`);
    });
  }

  handleClose = () => {
    this.props.onClose();
  }

  handleChangeValue = name => event => {
    this.setState({
      [name]: event.target.value
    });
  }

  handleChangeProtocol = (event) => {
    this.setState({
      protocol: event.target.value
    });
  }

  render() {
    const { classes, open = false } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} fullWidth={true} PaperProps={{ square: true }}>
        <DialogTitle disableTypography={true} style={{ background: '#5a5a5a', color: '#ffffff', height: '20px', padding: 4 }}
        >환경 설정</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" style={{ marginTop: 20 }}>
            <FormLabel component="legend">프로토콜(Protocol)</FormLabel>
            <RadioGroup aria-label="position" name="position" value={this.state.protocol} onChange={this.handleChangeProtocol} row>
              <CustomCssFormControlLabel
                value="http:"
                control={<CustomCssRadio />}
                label="HTTP"
                labelPlacement="end"
              />
              <CustomCssFormControlLabel
                value="https:"
                control={<CustomCssRadio />}
                label="HTTPS"
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>

          <TextField required fullWidth label="서버 주소"
            onChange={this.handleChangeValue('hostname')}
            value={this.state.hostname}
            margin="normal"
            helperText="클라우드 저장소 서버 주소(URL) 정보"
          />

          <TextField fullWidth label="포트(Port)"
            onChange={this.handleChangeValue('port')}
            value={this.state.port}
            className={classes.textField}
            margin="normal"
            helperText="서버 접속 포트 정보"
          />

        </DialogContent>
        <DialogActions>
          <Grid container spacing={3}>
            <Grid item xs={6} style={{ paddingTop: '25px' }}></Grid>
            <Grid item xs={6} style={{ paddingTop: '25px', textAlign: 'right' }}>
              <Button onClick={this.handleSaveData} className={classes.RCSmallButton} style={{ marginRight: 20 }}
                variant="contained" color="primary"
              >저장</Button>
              <Button onClick={this.handleClose} className={classes.RCSmallButton}
                variant="contained" color="secondary"
              >닫기</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(ServerSettingDialog));
