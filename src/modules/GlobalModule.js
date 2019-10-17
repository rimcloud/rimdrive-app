
import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

const SHOW_ELEMENT_MESSAGE = 'global/SHOW_ELEMENT_MESSAGE';
const CLOSE_ELEMENT_MESSAGE = 'global/CLOSE_ELEMENT_MESSAGE';

const SET_DATASTORAGE_SUCCESS = 'global/SET_DATASTORAGE_SUCCESS';

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

export const setDataStorage = (param) => dispatch => {
    dispatch({
        type: SET_DATASTORAGE_SUCCESS,
        driveConfig: param.driveConfig
    });
    
    return new Promise(function (resolve, reject) {
        resolve('result test');
      });

};

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

export default handleActions({

    [SET_DATASTORAGE_SUCCESS]: (state, action) => {
        return state.merge({
            'driveConfig': action.driveConfig
        });
    },

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
    }
}, initialState);



