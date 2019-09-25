
import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

const INIT_SYNCDATA_SUCCESS = 'global/INIT_SYNCDATA_SUCCESS';

const SHOW_ELEMENT_MESSAGE = 'global/SHOW_ELEMENT_MESSAGE';
const CLOSE_ELEMENT_MESSAGE = 'global/CLOSE_ELEMENT_MESSAGE';

const CHG_STORE_DATA = 'global/CHG_STORE_DATA';

// ...
const initialState = Map({
    popoverElement: null,
    popoverText: '',
    syncData: ''
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

}, initialState);



