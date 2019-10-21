import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/utils/RCRequester';

const GET_DEPTLIST_SUCCESS = 'user/GET_DEPTLIST_SUCCESS';
const GET_USERLIST_SUCCESS = 'user/GET_USERLIST_SUCCESS';

const SET_DEPTINFO_SUCCESS = 'user/SET_DEPTINFO_SUCCESS';
const SET_SELECTEDUSER_SUCCESS = 'user/SET_SELECTEDUSER_SUCCESS';

const SET_SHAREDDEPT_SUCCESS = 'file/SET_SHAREDDEPT_SUCCESS';
const SET_SHAREDUSER_SUCCESS = 'file/SET_SHAREDUSER_SUCCESS';

// ...
const initialState = Map({
    userListData: null
});

export const setDeptForShare = (param) => dispatch => {
    return dispatch({
        type: SET_SHAREDDEPT_SUCCESS,
        selectedDept: param.selectedDept,
        isChecked: param.isChecked
    });
};

export const setUserForShare = (param) => dispatch => {
    return dispatch({
        type: SET_SHAREDUSER_SUCCESS,
        selecteUser: param.selecteUser,
        isChecked: param.isChecked
    });
};

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
// {
//     "deptCd": "cloud00000",
//     "deptNm": "test",
//     "uprDeptCd": "0",
//     "whleDeptCd": "0;cloud00000;",
//     "deptLevel": "1",
//     "optYn": "Y",
//     "sortSord": 1,
//     "hasSubDept": null,
//     "modifyDate": 1564481814000,
//     "modifyUid": "admin",
//     "createDate": 1564481814000,
//     "createUid": "admin"
// }
const makeDeptList = (data, deptList) => {

    if(data && data.length > 0) {
        // add root node for tree
        if(deptList.size < 1) {
            deptList = deptList.push(Map({
                deptCd: '0',
                deptNm: '__ROOTDEPT__',
                children: List([])
            }));
        }
        data.forEach((n, i) => {
            
            if(n.deptCd !== '0') {
                const parentIndex = deptList.findIndex(e => (e.get('deptCd') === n.uprDeptCd));
                if(parentIndex > -1) {
                    // 부모가 이미 들어있음, 칠드런에 추가
                    let parent = deptList.get(parentIndex);
                    let children = parent.get('children');
                    if(!children.includes(n.deptCd)) {
                        children = children.push(n.deptCd);
                        parent = parent.set('children', children);
                        deptList = deptList.set(parentIndex, parent);
                    }
                }
    
                // deptList 에 자신 추가 - 없으면 추가
                const selfIndex = deptList.findIndex(e => (e.get('deptCd') === n.deptCd));
                if(selfIndex < 0) {
                    // add this node for tree
                    deptList = deptList.push(Map({
                        deptCd: n.deptCd,
                        deptNm: n.deptNm,
                        children: List([])
                    }));
                }
            }
        });
    }

    return deptList;
}

export const getDeptList = (param) => dispatch => {
    return requestPostAPI('http://demo-ni.cloudrim.co.kr:48080/vdrive/org/api/deptlist.ros', {
        param: 'param'
    }).then(
        (response) => {
            let deptList = List([]);
            if(response.data && response.data.status && response.data.status.result === 'SUCCESS') {
                deptList = makeDeptList(response.data.data, deptList);
                deptList = makeDeptList(response.data.data, deptList);
            }
            dispatch({
                type: GET_DEPTLIST_SUCCESS,
                deptList: deptList
            });
        }
    ).catch(error => {
        console.log('error : ', error);
    });
}

export const showUserDetail = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTEDUSER_SUCCESS,
        selectedUser: param.selectedUser
    });
};

export const getUserList = (param) => dispatch => {
    return requestPostAPI('http://demo-ni.cloudrim.co.kr:48080/vdrive/org/api/emplist.ros', {
        deptCd: param.selectedDeptCd
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

    [SET_SHAREDDEPT_SUCCESS]: (state, action) => {
        let shareDepts = state.get('shareDepts');
        if(shareDepts !== undefined) {
            if(action.isChecked) {
                shareDepts = shareDepts.push(action.selectedDept);
            } else {
                const i = shareDepts.findIndex((n) => (n.get('deptCd') === action.selectedDept.get('deptCd')));
                shareDepts = shareDepts.delete(i);
            }
        } else {
            if(action.isChecked) {
                shareDepts = List([action.selectedDept]);
            }
        }
        return state.set('shareDepts', shareDepts);
    },
    [SET_SHAREDUSER_SUCCESS]: (state, action) => {
        let shareUsers = state.get('shareUsers');
        if(shareUsers !== undefined) {
            if(action.isChecked) {
                shareUsers = shareUsers.push(action.selectedUser);
            } else {
                const i = shareUsers.findIndex((n) => (n.get('deptCd') === action.selectedUser.get('deptCd')));
                shareUsers = shareUsers.delete(i);
            }
        } else {
            if(action.isChecked) {
                shareUsers = List([action.selectedUser]);
            }
        }
        return state.set('shareUsers', shareUsers);
    },



    [GET_DEPTLIST_SUCCESS]: (state, action) => {
        const deptList = action.deptList;
        return state.set('deptList', deptList);
    },
    [GET_USERLIST_SUCCESS]: (state, action) => {
        const data = action.response.data;
        return state.set('userListData', fromJS(data.data));
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



