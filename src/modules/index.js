import { combineReducers } from 'redux';

import GlobalModule from './GlobalModule';
import FileModule from './FileModule';
import AccountModule from './AccountModule';

export default combineReducers({

    GlobalModule,
    FileModule,
    AccountModule
});
