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
        selectedDept: param.selectedDept
    });
};

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



