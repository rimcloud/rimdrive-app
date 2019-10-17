import { handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';

import { requestGetAPI } from 'components/utils/RCRequester';

const GET_USERLIST_SUCCESS = 'user/GET_USERLIST_SUCCESS';
const SET_DEPTINFO_SUCCESS = 'user/SET_DEPTINFO_SUCCESS';
const SET_SELECTEDUSER_SUCCESS = 'user/SET_SELECTEDUSER_SUCCESS';

// ...
const initialState = Map({
    listData: null
});

export const showDeptInfo = (param) => dispatch => {
    return dispatch({
        type: SET_DEPTINFO_SUCCESS,
        listDataOLD: fromJS([
            { userId: "f1", userName: "file1", userGrade: "100" },
            { userId: "f2", userName: "file2", userGrade: "200" },
            { userId: "f3", userName: "file3", userGrade: "300" },
            { userId: "f4", userName: "file4", userGrade: "400" },
            { userId: "f5", userName: "file5", userGrade: "500" },
            { userId: "f6", userName: "file6", userGrade: "600" },
            { userId: "f7", userName: "file7", userGrade: "700" },
        ]),
        selectedDept: param.selectedDept
    });
};

export const showUserDetail = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTEDUSER_SUCCESS,
        selectedUser: param.selectedUser
    });
};

export const getUserList = (param) => dispatch => {
    return requestGetAPI('temp/user-list.json', {
        selectedDept: param.selectedDept
    }).then(
        (response) => {
            dispatch({
                type: GET_USERLIST_SUCCESS,
                response: response
            });
        }
    ).catch(error => {
        console.log('error : ', error);
    });
}

export default handleActions({

    [GET_USERLIST_SUCCESS]: (state, action) => {
        const data = action.response.data;
        return state.set('listData', fromJS(data.data));
    },
    [SET_DEPTINFO_SUCCESS]: (state, action) => {
        return state.set('selectedUser', null)
                .set('selectedDept', action.selectedDept);
    },
    [SET_SELECTEDUSER_SUCCESS]: (state, action) => {
        return state.set('selectedDept', null)
                .set('selectedUser', action.selectedUser);
    },

}, initialState);



