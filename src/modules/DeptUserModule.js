import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

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

    let tempResult = '{"data":[{"empId":"tuser02","empNm":"테스트","hlofcYn":"Y","cloudAllowYn":"Y","createTp":"C","ldapDeptCd":"nec1","ldapChgObjYn":"N","gpkiAuthValue":null,"loginId":"tuser02","createDate":null,"createUid":null,"modifyDate":null,"modifyUid":null,"pwdChgObjYn":"N","grade":"과장","sortSord":"2","deptCd":"nec1","deptNm":"1","quota":20,"siteCd":null},{"empId":"tuser01","empNm":"테스트","hlofcYn":"Y","cloudAllowYn":"Y","createTp":"C","ldapDeptCd":"nec1","ldapChgObjYn":"N","gpkiAuthValue":null,"loginId":"tuser01","createDate":null,"createUid":null,"modifyDate":null,"modifyUid":null,"pwdChgObjYn":"N","grade":"사원","sortSord":"13","deptCd":"nec1","deptNm":"1","quota":20,"siteCd":null}],"status":{"result":"SUCCESS","resultCode":"","message":"정상 처리되었습니다."}}';
    tempResult = JSON.parse(tempResult);
    tempResult = fromJS(tempResult);

    let listData = [];
    if(tempResult.getIn(['status', 'result']) === 'SUCCESS') {
        listData = tempResult.get('data');
    }

    return dispatch({
        type: GET_USERLIST_SUCCESS,
        listData:listData
    });

}

export default handleActions({

    [GET_USERLIST_SUCCESS]: (state, action) => {
        console.log('action.listData ::: ', action.listData);
        return state.set('listData', action.listData);
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



