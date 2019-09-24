
import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

import { requestPostAPI } from 'components/utils/RCRequester';

const COMMON_PENDING = 'account/COMMON_PENDING';
const COMMON_FAILURE = 'account/COMMON_FAILURE';
const CHG_ACCOUNTPARAM_DATA = 'account/CHG_ACCOUNTPARAM_DATA';
const REQ_LOGIN_PROCESS = 'account/REQ_LOGIN_PROCESS';

// ...
const initialState = Map({
    id: 'u1',
    password: 'p1',
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
    return requestPostAPI('vdrive/api/login.rim', {
        userid: userId,
        passwd: password
    }).then(
        (response) => {

            console.log('response :::: ', response);

            dispatch({
                type: REQ_LOGIN_PROCESS,
                response: response
            });
        }
    ).catch(error => {

        console.log('error :::: ', error);

        // 404
        // Test CODE
        dispatch({
            type: REQ_LOGIN_PROCESS,
            name: 'userToken',
            value: 'ttt'
        });

        // dispatch({ type: COMMON_FAILURE, error: error });
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
        return state.set(action.name, action.value);
    },
    [REQ_LOGIN_PROCESS]: (state, action) => {
        console.log('REQ_LOGIN_PROCESS : action :: ', action);
        return state.merge({[action.name]: action.value});
    }

}, initialState);

