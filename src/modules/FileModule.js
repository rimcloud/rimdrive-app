import { handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';

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
    return dispatch({
        type: GET_FILELIST_SUCCESS,
        listData: fromJS([
            { fileId: "f1", fileName: "file1", fileSize: "100" },
            { fileId: "f2", fileName: "file2", fileSize: "200" },
            { fileId: "f3", fileName: "file3", fileSize: "300" },
            { fileId: "f4", fileName: "file4", fileSize: "400" },
            { fileId: "f5", fileName: "file5", fileSize: "500" },
            { fileId: "f6", fileName: "file6", fileSize: "600" },
            { fileId: "f7", fileName: "file7", fileSize: "700" },
        ]),
        selectedFolder: param.selectedFolder
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



