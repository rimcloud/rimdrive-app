import { combineReducers } from 'redux';

import GlobalModule from './GlobalModule';
import FileModule from './FileModule';
import DeptUserModule from './DeptUserModule';
import AccountModule from './AccountModule';
import ShareModule from './ShareModule';

export default combineReducers({

    GlobalModule,
    FileModule,
    DeptUserModule,
    AccountModule,
    ShareModule
    
});
