
import { handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';

const INIT_SYNCDATA_SUCCESS = 'global/INIT_SYNCDATA_SUCCESS';
const ADD_SYNCDATA_SUCCESS = 'global/ADD_SYNCDATA_SUCCESS';

const SHOW_ELEMENT_MESSAGE = 'global/SHOW_ELEMENT_MESSAGE';
const CLOSE_ELEMENT_MESSAGE = 'global/CLOSE_ELEMENT_MESSAGE';

const CHG_STORE_DATA = 'global/CHG_STORE_DATA';

// ...
const initialState = Map({
    popoverElement: null,
    popoverText: '',
    syncData: Map({})
});

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

export default handleActions({

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
        return state.merge({
            syncData: action.syncData
        });
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
    }

}, initialState);



