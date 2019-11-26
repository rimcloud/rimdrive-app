import React, { Component } from "react";
import { ipcRenderer } from 'electron';
import path from 'path';

import { fromJS } from 'immutable';
import fs from 'fs';
// import log from 'electron-log';

import { withStyles } from '@material-ui/core/styles';
import { CommonStyle } from 'templates/styles/CommonStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { getLocalFiles, getCloudFiles, startCompareData, handleSyncTimer } from 'components/utils/RCSyncUtil';
import { getAppRoot } from 'components/utils/RCCommonUtil';

import * as AccountActions from 'modules/AccountModule';
import * as FileActions from 'modules/FileModule';
import * as GlobalActions from 'modules/GlobalModule';

import SyncSingleItem from 'components/parts/SyncSingleItem';
import RCDialogConfirm from 'components/utils/RCDialogConfirm';
import CloudFolderTreeDialog from 'components/parts/CloudFolderTreeDialog';

class SyncPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemCount: 0,
            selectedTab: 0,
            pathItems: '',
            
            openCloudFolderDialog: false
        };
    }

    componentDidMount() {
        const { FileActions } = this.props;
        // get cloud folders
        FileActions.getDriveFolderList({
            userId: this.props.AccountProps.get('userId')
        });
    }

    handleChangeValue = name => event => {
        this
            .props
            .AccountActions
            .changeAccountParamData({ name: name, value: event.target.value });
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
        const driveConfig = GlobalProps.get('driveConfig');

        let newNo = 1;
        if (driveConfig.get('syncItems').value() === undefined) {
            driveConfig.assign('syncItems', []).write();
        }

        const syncItems = driveConfig.get('syncItems').value();
        if (syncItems.length > 0) {
            const getMax = (accumulator, currentValue) => accumulator.no < currentValue.no ? currentValue : accumulator;
            const latest = syncItems.reduce(getMax);
            newNo = Number(latest.no) + 1;
        }

        driveConfig.get('syncItems')
            .push({
                "no": newNo,
                "local": "",
                "cloud": "",
                "type": "a",
                "status": "on"
            }).write();

        this.setState({
            itemCount: this.state.itemCount + 1
        });
    }

    handleDeleteItem = (no) => {
        this.props.GlobalActions.showConfirm({
            confirmTitle: "동기화 삭제",
            confirmMsg: "동기화 항목을 삭제 하시겠습니까?",
            handleConfirmResult: (confirmValue, paramObject) => {
                if (confirmValue) {
                    const { GlobalProps } = this.props;
                    const driveConfig = GlobalProps.get('driveConfig');
                    driveConfig.get('syncItems')
                        .remove({ no: paramObject })
                        .write();
                }
            },
            confirmObject: no
        });
    };

    handleStartSyncFile = (no) => {
        // log.info('[handleStartSyncFile] ============================== ', no);
        this.props.GlobalActions.showConfirm({
            confirmTitle: "동기화 실행",
            confirmMsg: "동기화를 실행 하시겠습니까?",
            handleConfirmResult: (confirmValue, paramObject) => {
                if (confirmValue) {
                    const { GlobalProps } = this.props;
                    const driveConfig = GlobalProps.get('driveConfig');
                    const syncItems = driveConfig.get('syncItems')
                        .find({ no: paramObject }).value();

                    // ## LOCAL FILEs SAVE
                    // log.info('[handleStartSyncFile] =[1]=');
                    const localFiles = getLocalFiles(syncItems);
                    // log.info(`[handleStartSyncFile] =[2]=   ${getAppRoot()}${path.sep}`);
                    const localAdapter = new FileSync(`${getAppRoot()}${path.sep}rimdrive-local.json`);
                    // log.info('[handleStartSyncFile] =[3]=');
                    const localDB = low(localAdapter);
                    // log.info('[handleStartSyncFile] =[4]=');
                    localDB.assign({ files: localFiles }).write();
                    // log.info('[handleStartSyncFile] =[5]=');

                    // ## CLOUD FILEs SAVE
                    const cloudFiles = getCloudFiles(this.props.AccountProps.get('userId'), syncItems); /// ???????
                    // log.info('[handleStartSyncFile] =[6]=');
                    const cloudAdapter = new FileSync(`${getAppRoot()}${path.sep}rimdrive-cloud.json`);
                    // log.info('[handleStartSyncFile] =[7]=');
                    const cloudDB = low(cloudAdapter);
                    // log.info('[handleStartSyncFile] =[8]=');
                    cloudDB.assign({ files: cloudFiles }).write();

                    ipcRenderer.sendSync('set_sync_valiable', {
                        localTarget: syncItems.local,
                        cloudTarget: syncItems.cloud
                    });

                    // // ## Compare Data
                    // log.info('[handleStartSyncFile] =[9]=');
                    startCompareData(this.props.AccountProps.get('userId'), localDB, cloudDB, syncItems.local, syncItems.cloud);
                        //.then((resolvedData) => {
                            // console.log('############### startCompareData.then ################');
                            // console.log('resolvedData :::::::: ', resolvedData);
                        //});
                }
            },
            confirmObject: no
        });
    }

    handleOpenFolderDialog = (syncNo, locType) => {

        if (locType === 'local') {
            const pathItems = ipcRenderer.sendSync('sync-msg-select-folder');
            let selectedPath = '';

            // console.log('pathItems ::: ', pathItems);
            if (pathItems !== undefined && pathItems !== null) {
                if(pathItems.isArray && pathItems.length > 0) {
                    selectedPath = pathItems[0]
                } else {
                    selectedPath = pathItems;
                }
            
                const { GlobalProps } = this.props;
                const driveConfig = GlobalProps.get('driveConfig');
                driveConfig.get('syncItems')
                    .find({ no: syncNo })
                    .assign({ [locType]: selectedPath })
                    .write();
                this.setState({
                    reload: true
                });
            }
        } else if (locType === 'cloud') {
            this.setState({
                openCloudFolderDialog: true
            });
        }

    }

    handleCloseCloudFolderDialog = () => {
        this.setState({
            openCloudFolderDialog: false
        });
    }

    handleSelectCloudFolder = (selectedItem) => {
        // console.log('SyncPage handleSelectCloudFolder - selectedItem :: ', selectedItem);

        const { GlobalProps } = this.props;
        const driveConfig = GlobalProps.get('driveConfig');
        driveConfig.get('syncItems')
            .find({ no: 1 })
            .assign({ 'cloud': selectedItem.path })
            .write();
        this.setState({
            reload: true
        });

        this.setState({
            openCloudFolderDialog: false
        });
        // const targetSyncNo = this.state.targetSyncNo;
        // const targetSyncLoc = this.state.targetSyncLoc;

        // const { GlobalProps } = this.props;
        // const driveConfig = GlobalProps.get('driveConfig');
        // driveConfig.get('syncItems')
        // .find({ no: targetSyncNo })
        // .assign({ [targetSyncLoc]: selectedFolderPath})
        // .write();
    }

    handleChangeSyncType = (syncNo, syncType) => {
        const { GlobalProps, AccountProps } = this.props;
        const driveConfig = GlobalProps.get('driveConfig');
        const newType = driveConfig.get('syncItems')
            .find({ no: syncNo })
            .assign({ type: syncType })
            .write();
        
        // sync timer start or stop
        if(newType.type === 'm') {

            handleSyncTimer('kill', null, null);
        } else {
          
            handleSyncTimer('start', GlobalProps.get('driveConfig'), AccountProps.get('userId'));
        }
        
        this.setState({
            openCloudFolderDialog: false
        });
    }

    render() {
        const { classes, GlobalProps } = this.props;
        const driveConfig = GlobalProps.get('driveConfig');
        // console.log('driveConfig ::::::::::==:::::::::: ', (driveConfig) ? driveConfig.value() : 'null');
        // console.log('driveConfig.syncItems ::::::::::==:::::::::: ', (driveConfig) ? driveConfig.get('syncItems').value() : 'null');
        const items = this.state.pathItems;

        let currSyncDatas = null;

        if (driveConfig !== undefined && driveConfig.get('syncItems') !== undefined) {
            currSyncDatas = fromJS(driveConfig.get('syncItems').value());
        }

        console.log('currSyncDatas :::::::::::::::::::: ', currSyncDatas.toJS());
        // console.log('driveConfig :: ', driveConfig);
        // console.log('getState ::: ', (driveConfig) ? driveConfig.getState(): 'no');

        return (
            <div className={classes.card}>
                {currSyncDatas && currSyncDatas.map((s, i) => (
                    <SyncSingleItem item={s} index={i + 1}
                        key={s.get('no')} isFirst={i === 0 ? true : false}
                        onShowFolderDialog={this.handleOpenFolderDialog}
                        onChangeSyncType={this.handleChangeSyncType}
                        onStartSyncFile={this.handleStartSyncFile}
                    />
                ))
                }
                <RCDialogConfirm />
                <CloudFolderTreeDialog open={this.state.openCloudFolderDialog}
                    onSelectCloudFolder={this.handleSelectCloudFolder}
                    onClose={this.handleCloseCloudFolderDialog}
                    pathItems={items}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    AccountProps: state.AccountModule,
    GlobalProps: state.GlobalModule,
    FileProps: state.FileModule
});

const mapDispatchToProps = (dispatch) => ({
    AccountActions: bindActionCreators(AccountActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SyncPage));

