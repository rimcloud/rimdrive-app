import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/utils/RCRequester';

const COMMON_FAILURE = 'share/COMMON_FAILURE';

const ADD_DEPTSHARE_SUCCESS = 'share/ADD_DEPTSHARE_SUCCESS';
const DELETE_DEPTSHARE_SUCCESS = 'share/DELETE_DEPTSHARE_SUCCESS';
const ADD_USERSHARE_SUCCESS = 'share/ADD_USERSHARE_SUCCESS';
const DELETE_USERSHARE_SUCCESS = 'share/DELETE_USERSHARE_SUCCESS';

const SET_PERMISSION_SUCCESS = 'share/SET_PERMISSION_SUCCESS';
const DELETE_SHAREITEM_SUCCESS = 'share/DELETE_SHAREITEM_SUCCESS';

const GET_SHARELIST_SUCCESS = 'share/GET_SHARELIST_SUCCESS';
const GET_SHAREINFO_SUCCESS = 'share/GET_SHAREINFO_SUCCESS';
const SET_SHAREINFO_SUCCESS = 'share/SET_SHAREINFO_SUCCESS';

const SET_REMOVESHAREITEM_SUCCESS = 'share/SET_REMOVESHAREITEM_SUCCESS';

// ...
const initialState = Map({
    initShare: null
});

export const setShareItemRemove = () => dispatch => {
    dispatch({
        type: SET_REMOVESHAREITEM_SUCCESS
    });
}

export const getShareInfoList = (param) => dispatch => {
    return requestPostAPI('http://demo-ni.cloudrim.co.kr:48080/vdrive/so/api/list.ros', {
        uid: 'test01'
    }).then(
        (response) => {
            let shareInfoList = List([]);
            if(response.data && response.data.status && response.data.status.result === 'SUCCESS') {
                if(response.data.data.files && response.data.data.files.length > 0) {
                    shareInfoList = response.data.data.files.map((n) => ({
                        fileId : n.fileId,
                        storageId: n.storageId,
                        name: n.name,
                        path: n.path,
                        shareWithCnt: n.shareWithCnt,
                        shareWithAll: n.shareWithAll
                    }));
                }
            }
            dispatch({
                type: GET_SHARELIST_SUCCESS,
                shareInfoList: fromJS(shareInfoList)
            });
        }
    ).catch(error => {
        console.log('error : ', error);
    });
}

export const getShareInfo = (param) => dispatch => {
    return requestPostAPI('http://demo-ni.cloudrim.co.kr:48080/vdrive/so/api/shareinfo.ros', {
        uid: param.sid,
        fid: param.fid
    }).then(
        (response) => {
            try {
                let shareDepts = List([]);
                let shareUsers = List([]);
                let shareInfo = null;
                if(response.data && response.data.status && response.data.status.result === 'SUCCESS') {
                    const share = response.data.data;
                    if(share && share.listShareTargetVO && share.shareVO) {
                        const list = share.listShareTargetVO;
                        if(list) {
                            list.forEach(n => {
                                if(n.targetTp === 'D') {
                                    shareDepts = shareDepts.push(fromJS(n));
                                } else if(n.targetTp === 'U') {
                                    shareUsers = shareUsers.push(fromJS(n));
                                }
                            });
                        }
                        dispatch({
                            type: GET_SHAREINFO_SUCCESS,
                            shareDepts: shareDepts,
                            shareUsers: shareUsers,
                            shareInfo: share.shareVO
                        });
                    }
                }

                return response.data;
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
                return error;
            }
        }
    ).catch(error => {
        console.log('error : ', error);
    });
}

export const setShareInfoCreate = (param) => dispatch => {
    let modifyShareList = [];
    if(param.shareDepts !== undefined && param.shareDepts.size > 0) {
        modifyShareList = modifyShareList.concat(param.shareDepts.toJS());
    }
    if(param.shareUsers !== undefined && param.shareUsers.size > 0) {
        modifyShareList = modifyShareList.concat(param.shareUsers.toJS());
    }

    return requestPostAPI('http://demo-ni.cloudrim.co.kr:48080/vdrive/so/api/add.ros', {
        uid: param.uid,
        fid: param.fid,
        it: JSON.stringify(modifyShareList)
    }).then(
        (response) => {
            try {
                if(response.data && response.data.status && response.data.status.result === 'SUCCESS') {

                } else {

                }
                return response.data;
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
                return error;
            }
        }
    ).catch(error => {
        console.log('error : ', error);
        return error;
    });
}

export const setShareInfoDelete = (param) => dispatch => {
    return requestPostAPI('http://demo-ni.cloudrim.co.kr:48080/vdrive/so/api/delete.ros', {
        uid: param.uid,
        shid: param.shid
    }).then(
        (response) => {
            try {
                if(response.data && response.data.status && response.data.status.result === 'SUCCESS') {

                } else {

                }
                return response.data;
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
                return error;
            }
        }
    ).catch(error => {
        console.log('error : ', error);
        return error;
    });
}

export const setShareInfoUpdate = (param) => dispatch => {
    let modifyShareList = [];
    if(param.shareDepts !== undefined && param.shareDepts.size > 0) {
        modifyShareList = modifyShareList.concat(param.shareDepts.toJS());
    }
    if(param.shareUsers !== undefined && param.shareUsers.size > 0) {
        modifyShareList = modifyShareList.concat(param.shareUsers.toJS());
    }

    let deleteShareList = [];
    if(param.formerShareDepts !== undefined && param.formerShareDepts.size > 0) {
        deleteShareList = deleteShareList.concat(param.formerShareDepts.toJS());
    }
    if(param.formerShareUsers !== undefined && param.formerShareUsers.size > 0) {
        deleteShareList = deleteShareList.concat(param.formerShareUsers.toJS());
    }

    return requestPostAPI('http://demo-ni.cloudrim.co.kr:48080/vdrive/so/api/update.ros', {
        uid: param.uid,
        shid: param.shid,
        it: JSON.stringify(modifyShareList),
        dt: JSON.stringify(deleteShareList)
    }).then(
        (response) => {
            try {
                if(response.data && response.data.status && response.data.status.result === 'SUCCESS') {

                } else {

                }
                return response.data;
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
                return error;
            }
        }
    ).catch(error => {
        console.log('error : ', error);
        return error;
    });
}

export const changePermission = (param) => dispatch => {
    let shareType = '';
    if(param.group === 'dept') {
        shareType = 'shareDepts';
    } else {
        shareType = 'shareUsers';
    }

    return dispatch({
        type: SET_PERMISSION_SUCCESS,
        shareType: shareType,
        id: param.id,
        value: param.value
    });
};


export const addDeptForShare = (param) => dispatch => {
    return dispatch({
        type: ADD_DEPTSHARE_SUCCESS,
        selectedDept: param.selectedDept,
        isChecked: param.isChecked
    });
};

export const deleteItemForShare = (param) => dispatch => {
    let shareType = '';
    if(param.group === 'dept') {
        shareType = 'shareDepts';
    } else {
        shareType = 'shareUsers';
    }

    return dispatch({
        type: DELETE_SHAREITEM_SUCCESS,
        shareType: shareType,
        id: param.id
    });
};

export const addUserForShare = (param) => dispatch => {
    return dispatch({
        type: ADD_USERSHARE_SUCCESS,
        selectedUser: param.selectedUser,
        isChecked: param.isChecked
    });
};

export const deleteUserForShare = (param) => dispatch => {
    return dispatch({
        type: DELETE_USERSHARE_SUCCESS,
        empId: param.empId
    });
};

export default handleActions({
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({ pending: false, error: true,
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },

    [SET_REMOVESHAREITEM_SUCCESS]: (state, action) => {
        return state.set('shareDepts', List([]))
                .set('formerShareDepts', List([]))
                .set('shareUsers', List([]))
                .set('formerShareUsers', List([]));
    },

    [GET_SHARELIST_SUCCESS]: (state, action) => {
        const shareInfoList = action.shareInfoList;
        return state.set('shareInfoList', shareInfoList);
    },
    [GET_SHAREINFO_SUCCESS]: (state, action) => {
        return state.set('shareDepts', action.shareDepts)
                .set('formerShareDepts', action.shareDepts)
                .set('shareUsers', action.shareUsers)
                .set('formerShareUsers', action.shareUsers)
                .set('shareInfo', action.shareInfo);
    },

    [SET_PERMISSION_SUCCESS]: (state, action) => {
        let shares = state.get(action.shareType);
        if(shares !== undefined) {
            const i = shares.findIndex((n) => (n.get('shareWithUid') === action.id));
            shares = shares.setIn([i, 'permissions'], action.value);
        }
        return state.set(action.shareType, shares);
    },
    [DELETE_SHAREITEM_SUCCESS]: (state, action) => {
        let shares = state.get(action.shareType);
        if(shares !== undefined) {
            const i = shares.findIndex((n) => (n.get('shareWithUid') === action.id));
            shares = shares.delete(i);
        }
        return state.set(action.shareType, shares);
    },

    [ADD_DEPTSHARE_SUCCESS]: (state, action) => {
        let shareDepts = state.get('shareDepts');
        if(shareDepts !== undefined) {
            if(action.isChecked) {
                shareDepts = shareDepts.push(action.selectedDept);
            } else {
                const i = shareDepts.findIndex((n) => (n.get('shareWithUid') === action.selectedDept.get('shareWithUid')));
                shareDepts = shareDepts.delete(i);
            }
        } else {
            if(action.isChecked) {
                shareDepts = List([action.selectedDept]);
            }
        }
        return state.set('shareDepts', shareDepts);
    },
    [DELETE_DEPTSHARE_SUCCESS]: (state, action) => {
        let shareDepts = state.get('shareDepts');
        if(shareDepts !== undefined) {
            const i = shareDepts.findIndex((n) => (n.get('shareWithUid') === action.deptCd));
            shareDepts = shareDepts.delete(i);
        }
        return state.set('shareDepts', shareDepts);
    },
    [ADD_USERSHARE_SUCCESS]: (state, action) => {
        let shareUsers = state.get('shareUsers');
        if(shareUsers !== undefined) {
            if(action.isChecked) {
                shareUsers = shareUsers.push(action.selectedUser);
            } else {
                console.log('>>>>>>>>>>> shareUsers : ', shareUsers.toJS());
                const i = shareUsers.findIndex((n) => (n.get('shareWithUid') === action.selectedUser.get('shareWithUid')));
                shareUsers = shareUsers.delete(i);
            }
        } else {
            if(action.isChecked) {
                shareUsers = List([action.selectedUser]);
            }
        }
        return state.set('shareUsers', shareUsers);
    },
    [DELETE_USERSHARE_SUCCESS]: (state, action) => {
        let shareUsers = state.get('shareUsers');
        if(shareUsers !== undefined) {
            const i = shareUsers.findIndex((n) => (n.get('shareWithUid') === action.empId));
            shareUsers = shareUsers.delete(i);
        }
        return state.set('shareUsers', shareUsers);
    },
    [SET_SHAREINFO_SUCCESS]: (state, action) => {
        return state;
    }

}, initialState);



