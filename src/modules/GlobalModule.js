
import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

const INIT_SYNCDATA_SUCCESS = 'global/INIT_SYNCDATA_SUCCESS';
const ADD_SYNCDATA_SUCCESS = 'global/ADD_SYNCDATA_SUCCESS';
const DELETE_SYNCDATA_SUCCESS = 'global/DELETE_SYNCDATA_SUCCESS';
const CHG_SYNCTYPE_SUCCESS = 'global/CHG_SYNCTYPE_SUCCESS';
const CHG_SYNCLOCALFOLDER_SUCCESS = 'global/CHG_SYNCLOCALFOLDER_SUCCESS';

const SHOW_ELEMENT_MESSAGE = 'global/SHOW_ELEMENT_MESSAGE';
const CLOSE_ELEMENT_MESSAGE = 'global/CLOSE_ELEMENT_MESSAGE';

const CHG_STORE_DATA = 'global/CHG_STORE_DATA';

const SHOW_CONFIRM = 'global/SHOW_CONFIRM';
const CLOSE_CONFIRM = 'global/CLOSE_CONFIRM';

// ...
const initialState = Map({
    popoverElement: null,
    popoverText: '',
    syncData: Map({}),

    handleConfirmResult: () => {},
    confirmTitle: '',
    confirmMsg: '',
    confirmCheckMsg: '',
    confirmOpen: false,
    confirmResult: false,
    confirmObject: null
});

export const showConfirm = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFIRM,
        confirmTitle: param.confirmTitle,
        confirmMsg: param.confirmMsg,
        confirmOpen: true,
        handleConfirmResult: param.handleConfirmResult,
        confirmObject: param.confirmObject
    });
};
export const closeConfirm = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFIRM
    });
};

export const showElementMsg = (elementObj, text) => dispatch => {
    return dispatch({
        type: SHOW_ELEMENT_MESSAGE,
        elementObj: elementObj,
        text: text
    });
};

export const closeElementMsg = (param) => dispatch => {
    return dispatch({
        type: CLOSE_ELEMENT_MESSAGE
    });
};

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        name: param.name,
        value: param.value
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

export const chgSyncLocalFolderData = (param) => dispatch => {
    return dispatch({
        type: CHG_SYNCLOCALFOLDER_SUCCESS,
        syncNo: param.no,
        value: param.value
    });
};


export default handleActions({

    [SHOW_CONFIRM]: (state, action) => {
        return state.merge({
            'confirmTitle': action.confirmTitle,
            'confirmMsg': action.confirmMsg,
            'confirmCheckMsg': action.confirmCheckMsg,
            'handleConfirmResult': action.handleConfirmResult,
            'confirmOpen': action.confirmOpen,
            'confirmObject': (action.confirmObject) ? action.confirmObject : null
        });
    },
    [CLOSE_CONFIRM]: (state, action) => {
        return state.merge({
            'confirmOpen': false,
            'confirmCheckOpen': false
        });
    },

    [CHG_STORE_DATA]: (state, action) => {
        return state.merge({[action.name]: action.value});
    },
    [SHOW_ELEMENT_MESSAGE]: (state, action) => {
        return state.merge({
            popoverElement: action.elementObj,
            popoverText: action.text
        });
    },
    [CLOSE_ELEMENT_MESSAGE]: (state, action) => {
        return state.merge({
            popoverElement: null,
            popoverText: ''
        });
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
    [CHG_SYNCLOCALFOLDER_SUCCESS]: (state, action) => {
        const syncs = state.getIn(['syncData', 'rimdrive', 'sync']);
        const index = syncs.findIndex(n => (n.get('no') === action.syncNo));
        let item = state.getIn(['syncData', 'rimdrive', 'sync', index]);
        item = item.set('pclocation', action.value);
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
                        "pclocation": "",
                        "cloudlocation": "",
                        "type": "a",
                        "status": "on"
                    }]
                }
            }));
        } else if(beforeCount === 1) {
            const newNo = Number(state.getIn(['syncData', 'rimdrive', 'sync', 0, 'no'])) + 1;
            const newSync = state.getIn(['syncData', 'rimdrive', 'sync']).push(fromJS({
                        "no": newNo,
                        "pclocation": "",
                        "cloudlocation": "",
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



