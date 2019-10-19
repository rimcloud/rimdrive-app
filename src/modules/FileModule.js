import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/utils/RCRequester';

const GET_FOLDERLIST_SUCCESS = 'file/GET_FOLDERLIST_SUCCESS';

const GET_FILELIST_SUCCESS = 'file/GET_FILELIST_SUCCESS';
const SET_SELECTEDFILE_SUCCESS = 'file/SET_SELECTEDFILE_SUCCESS';

const INIT_SYNCDATA_SUCCESS = 'global/INIT_SYNCDATA_SUCCESS';
const ADD_SYNCDATA_SUCCESS = 'global/ADD_SYNCDATA_SUCCESS';
const DELETE_SYNCDATA_SUCCESS = 'global/DELETE_SYNCDATA_SUCCESS';
const CHG_SYNCTYPE_SUCCESS = 'global/CHG_SYNCTYPE_SUCCESS';

// ...
const initialState = Map({
    listData: null
});

export const showFolderInfo = (param) => dispatch => {

    const selectedFolder = param.selectedFolder;

    return requestPostAPI('http://demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros', {
        method: 'FINDFILES',
        userid: 'test01',
        path: '/개인저장소/모든파일' + selectedFolder.get('folderPath')
    }).then(
        (response) => {
            let fileList = List([]);
            if(response.data && response.data.status && response.data.status.result === 'SUCCESS') {
                const files = response.data.data.filter(n => (n.fileType !== 'D')).map((n) => {
                    return Map({
                        fileId: n.fileId,
                        fileName: n.name,
                        filePath: n.path,
                        fileSize: n.size
                    });
                });
                fileList = List(files);
            }

            dispatch({
                type: GET_FILELIST_SUCCESS,
                listData : fileList,
                selectedFolder: param.selectedFolder
            });
        }
    ).catch(error => {
        console.log('error : ', error);
    });

    
    // return dispatch({
    //     type: GET_FILELIST_SUCCESS,
    //     listData: fromJS([
    //         { fileId: "f1", fileName: "file1", fileSize: "100" },
    //         { fileId: "f2", fileName: "file2", fileSize: "200" },
    //         { fileId: "f3", fileName: "file3", fileSize: "300" },
    //         { fileId: "f4", fileName: "file4", fileSize: "400" },
    //         { fileId: "f5", fileName: "file5", fileSize: "500" },
    //         { fileId: "f6", fileName: "file6", fileSize: "600" },
    //         { fileId: "f7", fileName: "file7", fileSize: "700" },
    //     ]),
    //     selectedFolder: param.selectedFolder
    // });
};

const makeFolderList = (data, folderList) => {

    if(data && data.length > 0) {
        // add root node for tree
        if(folderList.size < 1) {
            folderList = folderList.push(Map({
                folderId: data[0].parentId,
                folderName: '__ROOT__',
                folderPath: '/',
                children: List([])
            }));
        }
        data.forEach((n, i) => {
            // console.log(n.fileType, n.name, n.fileId, n.parentId, n.path, n.orgPath);
            const parentIndex = folderList.findIndex(e => (e.get('folderId') === n.parentId));
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

            // folderList 에 자신 추가 - 없으면 추가
            const selfIndex = folderList.findIndex(e => (e.get('folderId') === n.fileId));
            if(selfIndex < 0) {
                // add this node for tree
                folderList = folderList.push(Map({
                    folderId: n.fileId,
                    folderName: n.name,
                    folderPath: n.path,
                    children: List([])
                }));
            }
        });
    }

    return folderList;
}

export const getDriveFolderList = (param) => dispatch => {
    return requestPostAPI('http://demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros', {
        method: 'FOLDERLISTALL',
        userid: 'test01',
        path: '/개인저장소/모든파일'
    }).then(
        (response) => {
            let folderList = List([]);
            if(response.data && response.data.status && response.data.status.result === 'SUCCESS') {
                folderList = makeFolderList(response.data.data, folderList);
                folderList = makeFolderList(response.data.data, folderList);
                // console.log('folderList ::: ', folderList.toJS());
            }
            dispatch({
                type: GET_FOLDERLIST_SUCCESS,
                folderList: folderList
            });
        }
    ).catch(error => {
        console.log('error : ', error);
    });
}

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
        return state.set('listData', action.listData)
                .set('selectedFile', null)
                .set('selectedFolder', action.selectedFolder);
    },
    [SET_SELECTEDFILE_SUCCESS]: (state, action) => {
        return state.set('selectedFolder', null)
                .set('selectedFile', action.selectedFile);
    },
    [INIT_SYNCDATA_SUCCESS]: (state, action) => {
        // console.log('action.syncData : :: ', action.syncData);
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



