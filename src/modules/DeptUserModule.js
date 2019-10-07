import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

const GET_USERLIST_SUCCESS = 'user/GET_USERLIST_SUCCESS';
const SET_SELECTEDUSER_SUCCESS = 'user/SET_SELECTEDUSER_SUCCESS';

// ...
const initialState = Map({
    listData: null
});

export const showDeptInfo = (param) => dispatch => {
    return dispatch({
        type: GET_USERLIST_SUCCESS,
        listData: fromJS([
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

export default handleActions({

    [GET_USERLIST_SUCCESS]: (state, action) => {
        return state.set('listData', action.listData)
                .set('selectedUser', null)
                .set('selectedDept', action.selectedDept);
    },
    [SET_SELECTEDUSER_SUCCESS]: (state, action) => {
        return state.set('selectedDept', null)
                .set('selectedUser', action.selectedUser);
    },

}, initialState);



