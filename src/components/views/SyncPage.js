import React, {Component} from "react";
import { fromJS } from 'immutable';
import fs from 'fs';

import {withStyles} from '@material-ui/core/styles';
import {CommonStyle} from 'templates/styles/CommonStyles';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as AccountActions from 'modules/AccountModule';
import * as GlobalActions from 'modules/GlobalModule';

import SyncItem from 'components/parts/SyncItem';
import RCDialogConfirm from 'components/utils/RCDialogConfirm';
import FolderTreeDialog from 'components/parts/FolderTreeDialog';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

class SyncPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        };
    }

    componentDidMount() {
        const { GlobalActions } = this.props;
        console.log('SyncPage : componentDidMount');

        fs.readFile('rimdrive-app.cfg', 'utf8', (err, syncData) => {
            console.log('syncData ::', syncData);
            if(syncData !== undefined && syncData !== '') {
                 GlobalActions.initSyncData({
                     syncData: fromJS(JSON.parse(syncData))
                 });
            }
        });
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

    handleDeleteItem = (no) => {
        const { GlobalProps, GlobalActions } = this.props;

        let syncItem = [];
        if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync'])) {
            syncItem = GlobalProps.getIn(['syncData', 'rimdrive', 'sync']).find((n) => (n.get('no') === no));
        }

        GlobalActions.showConfirm({
            confirmTitle: "동기화 삭제",
            confirmMsg: "동기화 항목을 삭제 하시겠습니까?",
            handleConfirmResult: (confirmValue, paramObject) => {
                if(confirmValue) {
                    const { GlobalActions } = this.props;
                    GlobalActions.deleteSyncItemData({
                        no: paramObject.get('no')
                    });
                }
            },
            confirmObject: syncItem
        });
    };

    handleOpenFolderDialog = (syncNo, syncLoc) => {
        this.setState({
            openFolderDialog: true,
            targetSyncNo: syncNo,
            targetSyncLoc: syncLoc
        });
    }
    
    handleCloseFolderDialog = () => {
        this.setState({
            openFolderDialog: false
        });
    }

    handleSelectFolder = (selectedFolderPath) => {
        console.log('handleSelectFolder...');

        this.setState({
            openFolderDialog: false
        });
        const targetSyncNo = this.state.targetSyncNo;
        const targetSyncLoc = this.state.targetSyncLoc;
        // change store
        if(targetSyncLoc === 'local') {
            this.props.GlobalActions.chgSyncLocalFolderData({
                no: targetSyncNo, 
                value: selectedFolderPath
            });
        } else {
            // cloud folder

        }

        console.log('targetSyncNo ::::: ', targetSyncNo);
        console.log('targetSyncLoc ::::: ', targetSyncLoc);
        console.log('selectedFolderPath ::::: ', selectedFolderPath);
    }


    render() {
        const { GlobalProps } = this.props;

        const openFolderDialog = this.state.openFolderDialog

        let currSyncDatas = [];
        if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync'])) {
            const syncs = GlobalProps.getIn(['syncData', 'rimdrive', 'sync']);
            if(syncs && syncs.size > 0) {
                currSyncDatas = syncs;
            }
        }
        console.log('currSyncDatas::: ', currSyncDatas);

        return (
            <React.Fragment>
                <Box style={{paddingTop:8, paddingBottom: 8, paddingRight: 18, textAlign:'right'}}>
                    <Button onClick={this.handleAddSyncClick} variant="contained" color="primary">
                        파일 동기화 추가
                    </Button>
                </Box>
                {currSyncDatas && currSyncDatas.map((s, i) => (
                    <SyncItem item={s} 
                        key={s.get('no')} isFirst={i === 0 ? true : false} 
                        onDeleteItem={this.handleDeleteItem}
                        onShowFolderDialog={this.handleOpenFolderDialog}
                    />
                ))
                }
                <RCDialogConfirm />
                <FolderTreeDialog open={openFolderDialog} 
                    onSelectFolder={this.handleSelectFolder}
                />
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
