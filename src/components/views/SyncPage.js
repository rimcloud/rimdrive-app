import React, {Component} from "react";
import electron, { ipcRenderer } from 'electron';

import { fromJS } from 'immutable';
import fs from 'fs';

import {withStyles} from '@material-ui/core/styles';
import {CommonStyle} from 'templates/styles/CommonStyles';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { getLocalFiles, getCloudFiles, startCompareData } from 'components/utils/RCSyncUtil';

import * as AccountActions from 'modules/AccountModule';
import * as FileActions from 'modules/FileModule';
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
            itemCount: 0,
            selectedTab: 0,
            pathItems: ''
        };
    }

    // componentDidMount() {
    //     const { GlobalProps } = this.props;

    //     // driveConfig
    //     if(GlobalProps.get('driveConfig') !== undefined) {
    //         const driveConfig = GlobalProps.get('driveConfig');
    //         let itemCount = 0;
    //         if(driveConfig.get('syncItems') && driveConfig.get('syncItems').value().length > 0) {
    //             itemCount = driveConfig.get('syncItems').value().length;
    //         }
    //         this.setState({
    //             itemCount: itemCount
    //         });
    //     }
    // }

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
        const driveConfig = GlobalProps.get('driveConfig');

        let newNo = 1;
        if(driveConfig.get('syncItems') === undefined) {
            driveConfig.set('syncItems', [])
            .write();
        } else {
            const syncItems = driveConfig.get('syncItems').value();
            const getMax = (accumulator, currentValue) => accumulator.no < currentValue.no ? currentValue : accumulator;
            const latest = syncItems
                .reduce(getMax);
            newNo = Number(latest.no) + 1;
        }

        driveConfig.get('syncItems')
        .push({ "no": newNo,
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
                if(confirmValue) {
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
        this.props.GlobalActions.showConfirm({
            confirmTitle: "동기화 실행",
            confirmMsg: "동기화를 실행 하시겠습니까?",
            handleConfirmResult: (confirmValue, paramObject) => {
                if(confirmValue) {
                    const { GlobalProps } = this.props;
                    const driveConfig = GlobalProps.get('driveConfig');
                    const syncItems = driveConfig.get('syncItems')
                    .find({ no: paramObject }).value();

                    // ## LOCAL FILEs SAVE
                    const localFiles = getLocalFiles(syncItems);
                    // console.log('getLocalFiles ==>> localFiles >>>::: ', localFiles);
                    const localAdapter = new FileSync(`${electron.remote.app.getAppPath()}/rimdrive-local.json`);
                    const localDB = low(localAdapter);
                    //dbLocal.defaults({ localFiles: [] }).write();
                    localDB.assign({files: localFiles}).write();

                    // ## CLOUD FILEs SAVE
                    const cloudFiles = getCloudFiles(syncItems); /// ???????
                    // console.log('getLocalFiles ==>> cloudFiles >>>::: ', cloudFiles);
                    const cloudAdapter = new FileSync(`${electron.remote.app.getAppPath()}/rimdrive-cloud.json`);
                    const cloudDB = low(cloudAdapter);
                    //dbLocal.defaults({ cloudFiles: [] }).write();
                    cloudDB.assign({files: cloudFiles}).write();

                    // ## Compare Data
                    startCompareData(localDB, cloudDB, syncItems.local, syncItems.cloud)
                        .then((resolvedData) => {
                            console.log('resolvedData :::::::: ', resolvedData);
                        });
                }
            },
            confirmObject: no
        });
    }

    handleOpenFolderDialog = (syncNo, syncLoc) => {
        const pathItems = ipcRenderer.sendSync('sync-msg-select-folder');

        if(pathItems && pathItems.length > 0) {
            const { GlobalProps } = this.props;
            const driveConfig = GlobalProps.get('driveConfig');
            driveConfig.get('syncItems')
            .find({ no: syncNo })
            .assign({ [syncLoc]: pathItems[0]})
            .write();
            this.setState({
                reload: true
            });
        }
    }

    handleCloseFolderDialog = () => {
        this.setState({
            openFolderDialog: false
        });
    }

    handleCloseFolderDialog = () => {
        this.setState({
            openFolderDialog: false
        });
    }

    // handleSelectFolder = (selectedFolderPath) => {
    //     this.setState({
    //         openFolderDialog: false
    //     });
    //     const targetSyncNo = this.state.targetSyncNo;
    //     const targetSyncLoc = this.state.targetSyncLoc;

    //     const { GlobalProps } = this.props;
    //     const driveConfig = GlobalProps.get('driveConfig');
    //     driveConfig.get('syncItems')
    //     .find({ no: targetSyncNo })
    //     .assign({ [targetSyncLoc]: selectedFolderPath})
    //     .write();
    // }

    handleChangeSyncType = (syncNo, syncType) => {
        const { GlobalProps } = this.props;
        const driveConfig = GlobalProps.get('driveConfig');
        driveConfig.get('syncItems')
        .find({ no: syncNo })
        .assign({ type: syncType})
        .write();
        this.setState({
            openFolderDialog: false
        });
    }

    render() {
        const { classes, GlobalProps } = this.props;
        const driveConfig = GlobalProps.get('driveConfig');
        const openFolderDialog = this.state.openFolderDialog;

        const items = this.state.pathItems;
        
        let currSyncDatas = null;
        
        if(driveConfig !== undefined && driveConfig.get('syncItems') !== undefined) {
            currSyncDatas = fromJS(driveConfig.get('syncItems').value());
        }
        
        // if(GlobalProps && GlobalProps.getIn(['syncData', 'rimdrive', 'sync'])) {
        //     const syncs = GlobalProps.getIn(['syncData', 'rimdrive', 'sync']);
        //     if(syncs && syncs.size > 0) {
        //         currSyncDatas = syncs;
        //     }
        // }

        
        // console.log('driveConfig :: ', driveConfig);
        // console.log('getState ::: ', (driveConfig) ? driveConfig.getState(): 'no');

        return (
            <React.Fragment>
                <Box style={{paddingTop:8, paddingBottom: 8, paddingRight: 18, textAlign:'right'}}>
                    <Button onClick={this.handleAddSyncClick} className={classes.RCSmallButton} variant="contained" color="primary">
                        파일 동기화 추가
                    </Button>
                </Box>
                {currSyncDatas && currSyncDatas.map((s, i) => (
                    <SyncItem item={s} index={i+1}
                        key={s.get('no')} isFirst={i === 0 ? true : false} 
                        onDeleteItem={this.handleDeleteItem}
                        onShowFolderDialog={this.handleOpenFolderDialog}
                        onChangeSyncType={this.handleChangeSyncType}
                        onStartSyncFile={this.handleStartSyncFile}
                    />
                ))
                }
                <RCDialogConfirm />
                <FolderTreeDialog open={openFolderDialog} 
                    onSelectFolder={this.handleSelectFolder}
                    onClose={this.handleCloseFolderDialog}
                    pathItems={items}
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
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    FileActions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(CommonStyle)(SyncPage));

