import {SET_SEARCH_VALUE, SET_SEARCH_CATEGORY} from '../type/customer.types';

import {INITIAL_STATE} from '../initialState'

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_SEARCH_VALUE:

            return {
                ...state,
                searchValue: action.payload,
            };

        case SET_SEARCH_CATEGORY:

            return {
                ...state,
                searchCategory: action.payload,
            };

        default: 
            return state;
    }
};

export default reducer;