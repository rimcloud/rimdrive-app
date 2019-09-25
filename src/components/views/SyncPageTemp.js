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

class SyncPage extends Component {
    
    componentDidMount() {
        const { GlobalProps } = this.props;
        console.log('SyncPage : componentDidMount');

        if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync'])) {
            console.log('-1-');
            const syncs = GlobalProps.getIn(['syncData', 'rimdrive', 'sync']);
            console.log('-11-', syncs);
            if(syncs && syncs.length > 0) {
                console.log('-2-');
                syncs.map(s => {
                    console.log(s);
                })
            }
        }
        // console.log('SyncPage -> componentDidMount.GlobalProps ::: ', (GlobalProps) ? GlobalProps.toJS() : '---');
    }

    handleLoginBtnClick = (e) => {
        const {AccountActions, AccountProps} = this.props;
        console.log('AccountProps ::: ', (AccountProps)
            ? AccountProps.toJS()
            : '--');
        AccountActions.reqLoginProcess(AccountProps.get('id'), AccountProps.get('password'));
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
                                PC폴더 : {s.pclocation}
                            </Typography>
                            <Typography variant="body2" component="p">
                                저장소폴더 : {s.cloudlocation}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
                }

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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SyncPage));
