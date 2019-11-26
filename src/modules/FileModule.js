import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { ipcRenderer } from 'electron';

const GET_FOLDERLIST_SUCCESS = 'file/GET_FOLDERLIST_SUCCESS';
const SET_SELECTEDITEM_SUCCESS = 'file/SET_SELECTEDITEM_SUCCESS';

const GET_FILELIST_SUCCESS = 'file/GET_FILELIST_SUCCESS';
const SET_FILELISTEMPTY_SUCCESS = 'file/SET_FILELISTEMPTY_SUCCESS';
const SET_SELECTEDFILE_SUCCESS = 'file/SET_SELECTEDFILE_SUCCESS';

const INIT_SYNCDATA_SUCCESS = 'global/INIT_SYNCDATA_SUCCESS';
const ADD_SYNCDATA_SUCCESS = 'global/ADD_SYNCDATA_SUCCESS';
const DELETE_SYNCDATA_SUCCESS = 'global/DELETE_SYNCDATA_SUCCESS';
const CHG_SYNCTYPE_SUCCESS = 'global/CHG_SYNCTYPE_SUCCESS';

// ...
const initialState = Map({
    listData: null
});

export const showFilesInFolder = (param) => dispatch => {
    return new Promise(function (resolve, reject) {
        const ipcResult = ipcRenderer.sendSync('post-req-to-server', {
            url: '/vdrive/file/api/files.ros',
            params: {
                'userid': encodeURI(param.userId), 
                'method': 'FINDFILES',
                'path': `/개인저장소/모든파일${param.path}`
            }
        });
        if(ipcResult) {
            if(ipcResult.status && ipcResult.status.result === 'SUCCESS') {
                const files = ipcResult.data.filter(n => (n.fileType !== 'D')).map((n) => {
                    return Map({
                        fileId: n.fileId,
                        fileName: n.name,
                        filePath: n.path,
                        fileSize: n.size
                    });
                });
                dispatch({
                    type: GET_FILELIST_SUCCESS,
                    listData : (files && files.length > 0) ? List(files) : List([])
                });
            }
            resolve(ipcResult.status);
        } else {
            reject('error');
        }
    });
};

export const setFileListEmpty = () => dispatch => {
    return dispatch({
        type: SET_FILELISTEMPTY_SUCCESS
    });
}

const makeFolderList = (data, folderList) => {
    if(data && data.length > 0) {
        data.forEach((n, i) => {
            if(n.folderId !== '10') {
                const parentIndex = folderList.findIndex(e => (e.get('fileId') === n.parentId));
                if(parentIndex > -1) {
                    // 부모가 이미 들어있음, 칠드런에 추가
                    let parent = folderList.get(parentIndex);
                    let children = parent.get('children');
                    if(!children.includes(n.fileId)) {
                        children = children.push(n.fileId);
                        parent = parent.set('children', children);
                        folderList = folderList.set(parentIndex, parent);
                    }
                }
            }
        });
    }
    return folderList;
}

export const getDriveFolderList = (param) => dispatch => {
    return new Promise(function (resolve, reject) {
        const ipcResult = ipcRenderer.sendSync('post-req-to-server', {
            url: '/vdrive/file/api/files.ros',
            params: {
                'userid': encodeURI(param.userId), 
                'method': 'FOLDERLISTALL',
                'path': `/개인저장소/모든파일`
            }
        });
        if(ipcResult) {
            if(ipcResult.status && ipcResult.status.result === 'SUCCESS') {
                let folderList = (fromJS(ipcResult.data.map(n => {n['children'] = []; return n;})).unshift(fromJS({
                    fileId: 10,
                    name: '개인저장소',
                    path: '/',
                    children: []
                })));
                folderList = makeFolderList(ipcResult.data, folderList);
    
                dispatch({
                    type: GET_FOLDERLIST_SUCCESS,
                    folderList: folderList
                });
            }
            resolve(ipcResult.status);
        } else {
            reject('error');
        }
    });
};

export const setSelectedItem = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTEDITEM_SUCCESS,
        selectedItem: param.selectedItem
    });
};

export const showFileDetail = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTEDFILE_SUCCESS,
        selectedFile: param.selectedFile
    });
};

export const initSyncData = (param) => dispatch => {
    return dispatch({
        type: INIT_SYNCDATA_SUCCESS,
        syncData: param.syncData
    });
};

export const addSyncItemData = () => dispatch => {
    return dispatch({
        type: ADD_SYNCDATA_SUCCESS
    });
};

export const deleteSyncItemData = (param) => dispatch => {
    return dispatch({
        type: DELETE_SYNCDATA_SUCCESS,
        no: param.no
    });
};

export const chgSyncTypeData = (param) => dispatch => {
    return dispatch({
        type: CHG_SYNCTYPE_SUCCESS,
        syncNo: param.no,
        value: param.value
    });
};

export default handleActions({

    [GET_FOLDERLIST_SUCCESS]: (state, action) => {
        const folderList = action.folderList;
        return state.set('folderList', folderList);
    },
    [GET_FILELIST_SUCCESS]: (state, action) => {
        return state.set('listData', action.listData);
    },
    [SET_FILELISTEMPTY_SUCCESS]: (state, action) => {
        return state.set('listData', []);
    },
    [SET_SELECTEDITEM_SUCCESS]: (state, action) => {
        return state.set('selectedItem', action.selectedItem);
    },

    [SET_SELECTEDFILE_SUCCESS]: (state, action) => {
        return state.set('selectedFolder', null)
                .set('selectedFile', action.selectedFile);
    },
    [INIT_SYNCDATA_SUCCESS]: (state, action) => {
        return state.merge({
            syncData: action.syncData
        });
    },
    [CHG_SYNCTYPE_SUCCESS]: (state, action) => {
        const syncs = state.getIn(['syncData', 'rimdrive', 'sync']);
        const index = syncs.findIndex(n => (n.get('no') === action.syncNo));
        let item = state.getIn(['syncData', 'rimdrive', 'sync', index]);
        item = item.set('type', action.value);
        return state.setIn(['syncData', 'rimdrive', 'sync', index], item);
    },
    [ADD_SYNCDATA_SUCCESS]: (state, action) => {
        let beforeCount = 0;
        if(state.getIn(['syncData', 'rimdrive'])) {
            if(state.getIn(['syncData', 'rimdrive', 'sync']).size === 1) {
                beforeCount = 1;
            }
        } else {
            beforeCount = 0;
        }

        if(beforeCount === 0) {
            return state
            .set('syncData', fromJS({
                rimdrive: {
                    sync: [{
                        "no": 1,
                        "local": "",
                        "cloud": "",
                        "type": "a",
                        "status": "on"
                    }]
                }
            }));
        } else if(beforeCount === 1) {
            const newNo = Number(state.getIn(['syncData', 'rimdrive', 'sync', 0, 'no'])) + 1;
            const newSync = state.getIn(['syncData', 'rimdrive', 'sync']).push(fromJS({
                        "no": newNo,
                        "local": "",
                        "cloud": "",
                        "type": "a",
                        "status": "on"
            }));
            return state.setIn(['syncData', 'rimdrive', 'sync'], newSync);
        } else {
            return state;
        }
    },
    [DELETE_SYNCDATA_SUCCESS]: (state, action) => {
        const no = action.no;
        const index = state.getIn(['syncData', 'rimdrive', 'sync']).findIndex((n) => (n.get('no') === no));
        
        return state.deleteIn(['syncData', 'rimdrive', 'sync', index]);
    }

}, initialState);



