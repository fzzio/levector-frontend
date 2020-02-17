import { combineReducers } from 'redux';

/*
    Common actions that reducers evaluate
    GET : to get current values in reducer.
    FETCH : to fill reducer with what comes from the API.
    UPDATE : to update an element of the reducer. It will need to specify an ID or Index of the element to update.
    EMPTY : to empty the reducer.
*/

import persona from './persona';
import loader from './loader';
import genderlist from './genderlist';

const rootReducer = combineReducers({
    persona,
    loader,
    genderlist
});

export default rootReducer;