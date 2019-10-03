
import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

const GET_FILELIST_SUCCESS = 'file/GET_FILELIST_SUCCESS';

// ...
const initialState = Map({
    listData: null
});

// get File List by folder
export const showFolderInfo = (param) => dispatch => {
    return dispatch({
        type: GET_FILELIST_SUCCESS,
        listData: fromJS([
            {fileId: "f1", fileName: "file1", fileSize: "100"},
            {fileId: "f2", fileName: "file2", fileSize: "200"},
            {fileId: "f3", fileName: "file3", fileSize: "300"},
            {fileId: "f4", fileName: "file4", fileSize: "400"},
            {fileId: "f5", fileName: "file5", fileSize: "500"},
            {fileId: "f6", fileName: "file6", fileSize: "600"},
            {fileId: "f7", fileName: "file7", fileSize: "700"},
        ])
    });
};

export default handleActions({

    [GET_FILELIST_SUCCESS]: (state, action) => {
        return state.set('listData', action.listData);
    },

}, initialState);



