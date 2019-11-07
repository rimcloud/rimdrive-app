import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/utils/RCRequester';

const GET_DEPTLIST_SUCCESS = 'user/GET_DEPTLIST_SUCCESS';
const GET_USERLIST_SUCCESS = 'user/GET_USERLIST_SUCCESS';
const SET_USERLISTEMPTY_SUCCESS = 'user/SET_USERLISTEMPTY_SUCCESS';

const SET_DEPTINFO_SUCCESS = 'user/SET_DEPTINFO_SUCCESS';
const SET_SELECTEDUSER_SUCCESS = 'user/SET_SELECTEDUSER_SUCCESS';

// ...
const initialState = Map({
    initDeptUser: null
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

// data
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

// const makeDeptListOLD = (data, deptList) => {
//     if(data && data.length > 0) {
//         // add root node for tree
//         if(deptList.size < 1) {
//             deptList = deptList.push(Map({
//                 deptCd: '0',
//                 deptNm: '__ROOTDEPT__',
//                 children: List([])
//             }));
//         }
//         data.forEach((n, i) => {
//             if(n.deptCd !== '0') {
//                 const parentIndex = deptList.findIndex(e => (e.get('deptCd') === n.uprDeptCd));
//                 if(parentIndex > -1) {
//                     // 부모가 이미 들어있음, 칠드런에 추가
//                     let parent = deptList.get(parentIndex);
//                     let children = parent.get('children');
//                     if(!children.includes(n.deptCd)) {
//                         children = children.push(n.deptCd);
//                         parent = parent.set('children', children);
//                         deptList = deptList.set(parentIndex, parent);
//                     }
//                 }
//                 // deptList 에 자신 추가 - 없으면 추가
//                 const selfIndex = deptList.findIndex(e => (e.get('deptCd') === n.deptCd));
//                 if(selfIndex < 0) {
//                     // add this node for tree
//                     deptList = deptList.push(Map({
//                         deptCd: n.deptCd,
//                         deptNm: n.deptNm,
//                         children: List([])
//                     }));
//                 }
//             }
//         });
//     }
//     return deptList;
// }

const makeDeptList = (data, deptList) => {
    if(data && data.length > 0) {
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
                deptList = fromJS(response.data.data.map(n => {n['children'] = []; return n;}));
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

export const setUserListEmpty = () => dispatch => {
    return dispatch({
        type: SET_USERLISTEMPTY_SUCCESS
    });
}

export default handleActions({

    [GET_DEPTLIST_SUCCESS]: (state, action) => {
        const deptList = action.deptList;
        return state.set('deptList', deptList);
    },
    [GET_USERLIST_SUCCESS]: (state, action) => {
        const data = action.response.data;
        return state.set('userListData', fromJS(data.data));
    },
    [SET_USERLISTEMPTY_SUCCESS]: (state, action) => {
        return state.set('userListData', List([]));
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



