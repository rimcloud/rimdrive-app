
import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { ipcRenderer } from 'electron';

const COMMON_PENDING = 'account/COMMON_PENDING';
const COMMON_FAILURE = 'account/COMMON_FAILURE';
const CHG_ACCOUNTPARAM_DATA = 'account/CHG_ACCOUNTPARAM_DATA';
const REQ_LOGIN_PROCESS = 'account/REQ_LOGIN_PROCESS';

const REQ_LOGINUSER_INFO = 'account/REQ_LOGINUSER_INFO';

// ...
const initialState = Map({
    userId: 'test01',
    password: 'test01',
    userToken: '',
    loginStatus: 'u3'
});

export const changeAccountParamData = (param) => dispatch => {
    return dispatch({
        type: CHG_ACCOUNTPARAM_DATA,
        name: param.name,
        value: param.value
    });
};

export const reqLoginProcess = (userId, password) => dispatch => {
    dispatch({type: COMMON_PENDING});
    const ipcResult = ipcRenderer.sendSync('login-to-server', {'userId': userId, 'password': password});
    // console.log('reqLoginProcess result ::-> ', ipcResult);
    if(ipcResult && ipcResult.result === 'SUCCESS') {
        return dispatch({
            type: REQ_LOGIN_PROCESS,
            name: 'userToken',
            value: 'userToken'
        });
    } else {
        return dispatch({
            type: REQ_LOGIN_PROCESS,
            name: 'userToken',
            value: ''
        });
    }

    // return requestPostAPI('vdrive/api/login.rim', {
    //     userid: userId,
    //     passwd: password
    // }).then(
    //     (response) => {
    //         dispatch({
    //             type: REQ_LOGIN_PROCESS,
    //             response: response
    //         });
    //     }
    // ).catch(error => {
    //     console.log('error :::: ', error);
    //     // 404
    //     // Test CODE
    //     dispatch({
    //         type: REQ_LOGIN_PROCESS,
    //         name: 'userToken',
    //         value: 'ttt'
    //     });

    //     // dispatch({ type: COMMON_FAILURE, error: error });
    // });
};

export const reqLoginUserInfo = (userId) => dispatch => {
    //console.log('reqLoginUserInfo - userId :: ', userId);
    dispatch({type: COMMON_PENDING});
    const ipcResult = ipcRenderer.sendSync('get-data-from-server', {
        url: 'demo-ni.cloudrim.co.kr:48080/vdrive/api/storageusage.ros',
        params: 'userid=test01'
    });
    // console.log('reqLoginUserInfo result ::-> ', ipcResult);
    if(ipcResult && ipcResult.status && ipcResult.status.result) {
        if(ipcResult.status.result === 'SUCCESS') {
            return dispatch({
                type: REQ_LOGINUSER_INFO,
                gadata: ipcResult.gadata,
                padata: ipcResult.padata
            });
        }
    } else {
        return dispatch({
            type: REQ_LOGINUSER_INFO,
            gadata: null,
            padata: null
        });
    }

    // if(ipcResult && ipcResult.result === 'SUCCESS') {
    //     return dispatch({
    //         type: REQ_LOGIN_PROCESS,
    //         name: 'userToken',
    //         value: 'userToken'
    //     });
    // } else {
    //     return dispatch({
    //         type: REQ_LOGIN_PROCESS,
    //         name: 'userToken',
    //         value: ''
    //     });
    // }

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
    [REQ_LOGIN_PROCESS]: (state, action) => {
        return state.merge({[action.name]: action.value});
    }

}, initialState);

