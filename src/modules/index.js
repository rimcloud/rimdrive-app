import { combineReducers } from 'redux';

import GlobalModule from './GlobalModule';
import FileModule from './FileModule';
import DeptUserModule from './DeptUserModule';
import AccountModule from './AccountModule';

export default combineReducers({

    GlobalModule,
    FileModule,
    DeptUserModule,
    AccountModule
});
