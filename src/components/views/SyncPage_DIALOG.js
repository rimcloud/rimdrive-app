import React, {Component} from "react";
import fs from 'fs';

import {withStyles} from '@material-ui/core/styles';
import {CommonStyle} from 'templates/styles/CommonStyles';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as AccountActions from 'modules/AccountModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class SyncPage_DIALOG extends Component {
    
    componentDidMount() {
        const { GlobalProps } = this.props;
        console.log('SyncPage_DIALOG : componentDidMount');
    }

    handleChangeValue = name => event => {
        this
            .props
            .AccountActions
            .changeAccountParamData({name: name, value: event.target.value});
    }

    handleSaveClick = (e) => {
        try {
            fs.writeFileSync('rimdrive-app.cfg', 'content', 'utf-8');
        } catch (e) {
            alert(e);
        }
    }

    handleClose = (e) => {

    }

    render() {
        const {classes} = this.props;
        const { GlobalProps } = this.props;

        const open = true;

        let currSyncData = [];
        if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync'])) {
            const syncs = GlobalProps.getIn(['syncData', 'rimdrive', 'sync']);
            if(syncs && syncs.length > 0) {
                currSyncData = syncs;
            }
        }

        return (
            <React.Fragment>

                <Box style={{padding:8, textAlign:'right'}}>
                    <Button onClick={this.handleAddSyncClick} variant="contained" color="primary">
                        파일 동기화 추가
                    </Button>
                </Box>
                {currSyncData && currSyncData.map(s => (
                    <Card className={classes.card} key={s.no}>
                        <RCContentCardHeader title={`NO.${s.no}`} subheader=""/>
                        <CardContent>
                            <Typography variant="body2" component="p">
                                PC폴더 : {s.local}
                            </Typography>
                            <Typography variant="body2" component="p">
                                저장소폴더 : {s.cloud}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
                }

                <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.handleClose} color="primary">
                    Subscribe
                  </Button>
                </DialogActions>
              </Dialog>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    AccountProps: state.AccountModule,
    GlobalProps: state.GlobalModule
});

const mapDispatchToProps = (dispatch) => ({
    AccountActions: bindActionCreators(AccountActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SyncPage_DIALOG));
