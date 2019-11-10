
import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { ipcRenderer } from 'electron';

const COMMON_PENDING = 'account/COMMON_PENDING';
const COMMON_FAILURE = 'account/COMMON_FAILURE';
const CHG_ACCOUNTPARAM_DATA = 'account/CHG_ACCOUNTPARAM_DATA';

const SET_LOGIN_SUCCESS = 'account/SET_LOGIN_SUCCESS';
const SET_LOGIN_FAIL = 'account/SET_LOGIN_FAIL';
const SET_LOGOUT_SUCCESS = 'account/SET_LOGOUT_SUCCESS';
const SET_LOGOUT_FAIL = 'account/SET_LOGOUT_FAIL';

const REQ_LOGINUSER_INFO = 'account/REQ_LOGINUSER_INFO';

// ...
const initialState = Map({
    userId: 'test01',
    password: 'test01',
    storageId: '',
    userToken: '',
    loginStatus: ''
});

export const changeAccountParamData = (param) => dispatch => {
    return dispatch({
        type: CHG_ACCOUNTPARAM_DATA,
        name: param.name,
        value: param.value
    });
};

export const reqLoginProcess = (userId, password) => dispatch => {
    return new Promise(function (resolve, reject) {
        const ipcResult = ipcRenderer.sendSync('post-req-to-server', {
            url: '/vdrive/api/login.ros',
            params: {'userid': encodeURI(userId), 'passwd': encodeURI(password)}
        });
        if(ipcResult) {
            if(ipcResult.status && ipcResult.status.result === 'SUCCESS') {
                dispatch({
                    type: SET_LOGIN_SUCCESS,
                    userToken: '__rimdrive__token__'
                });
            } else {
                dispatch({
                    type: SET_LOGIN_FAIL,
                    message: ipcResult.status.message,
                    resultCode: ipcResult.status.resultCode
                });
            }
            resolve(ipcResult.status);
        } else {
            reject('error');
        }
    });
};

export const reqLogoutProcess = (userId) => dispatch => {
    return new Promise(function (resolve, reject) {
        const ipcResult = ipcRenderer.sendSync('post-req-to-server', {
            url: '/vdrive/api/logout.ros',
            params: {'userid': encodeURI(userId)}
        });
        if(ipcResult) {
            if(ipcResult.status && ipcResult.status.result === 'SUCCESS') {
                dispatch({
                    type: SET_LOGOUT_SUCCESS,
                    message: '로그아웃 되었습니다.',
                    userToken: ''
                });
            } else {
                dispatch({
                    type: SET_LOGOUT_FAIL,
                    message: ipcResult.status.message,
                    resultCode: ipcResult.status.resultCode
                });
            }
            resolve(ipcResult.status);
        } else {
            reject('error');
        }
    });
};

export const reqLoginUserInfo = (userId) => dispatch => {
    return new Promise(function (resolve, reject) {
        const ipcResult = ipcRenderer.sendSync('post-req-to-server', {
            url: '/vdrive/api/storageusage.ros',
            params: {'userid': encodeURI(userId)}
        });
        if(ipcResult) {
            if(ipcResult.status && ipcResult.status.result === 'SUCCESS') {
                dispatch({
                    type: REQ_LOGINUSER_INFO,
                gadata: ipcResult.gadata,
                padata: ipcResult.padata
                });
            } else {
                dispatch({
                    type: REQ_LOGINUSER_INFO,
            gadata: null,
            padata: null
                });
            }
            resolve(ipcResult.status);
        } else {
            reject('error');
        }
    });
};

export default handleActions({

    [COMMON_PENDING]: (state, action) => {
        return state.merge({ pending: true, error: false });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({ pending: false, error: true,
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [CHG_ACCOUNTPARAM_DATA]: (state, action) => {
        const newState = state.set(action.name, action.value);
        return newState;
    },
    [REQ_LOGINUSER_INFO]: (state, action) => {
        const newState = state.set('gadata', action.gadata).set('padata', action.padata);
        return newState;
    },
    [SET_LOGIN_SUCCESS]: (state, action) => {
        return state.set('userToken', action.userToken).set('message', action.message);
    },
    [SET_LOGIN_FAIL]: (state, action) => {
        return state.set('message', action.message).set('resultCode', action.resultCode).set('loginResult', 'FAIL');
    },
    [SET_LOGOUT_SUCCESS]: (state, action) => {
        return state.set('message', action.message).set('userToken', action.userToken);
    },
    [SET_LOGOUT_FAIL]: (state, action) => {
        return state.set('message', action.message).set('resultCode', action.resultCode).set('logoutResult', 'FAIL');
    }

}, initialState);

