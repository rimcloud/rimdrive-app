import React, {Component} from "react";
import fs from 'fs';

import {withStyles} from '@material-ui/core/styles';
import {CommonStyle} from 'templates/styles/CommonStyles';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as AccountActions from 'modules/AccountModule';
import * as GlobalActions from 'modules/GlobalModule';

import RCContentCardHeader from 'components/parts/RCContentCardHeader';
import SyncItem from 'components/parts/SyncItem'

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class SyncPage extends Component {
    
    componentDidMount() {
        const { GlobalProps } = this.props;
        console.log('SyncPage : componentDidMount');
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


    handleAddSyncClick = () => {
        const { GlobalProps } = this.props;
        if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync']) && GlobalProps.getIn(['syncData', 'rimdrive', 'sync']).size > 1) {
            alert('동기화 항목은 최대 두개만 가능합니다.');
        } else {
            // 디폴트 동기화 항목 추가
            const { GlobalActions } = this.props;
            GlobalActions.addSyncItemData();
        }
    }

    handleClose = (e) => {
        const { GlobalProps } = this.props;
    }

    render() {
        const {classes} = this.props;
        const { GlobalProps } = this.props;

        let currSyncDatas = [];
        if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync'])) {
            const syncs = GlobalProps.getIn(['syncData', 'rimdrive', 'sync']);
            if(syncs && syncs.size > 0) {
                currSyncDatas = syncs;
            }
        }

        return (
            <React.Fragment>
                <Box style={{padding:8, textAlign:'right'}}>
                    <Button onClick={this.handleAddSyncClick} variant="contained" color="primary">
                        파일 동기화 추가
                    </Button>
                </Box>
                {currSyncDatas && currSyncDatas.map(s => (
                    <SyncItem item={s} key={s.get('no')} />
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
    AccountActions: bindActionCreators(AccountActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SyncPage));
