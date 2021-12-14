import {SET_SEARCH_VALUE, SET_SEARCH_CATEGORY} from '../type/customer.types';

export const setSearchValue = (payload) => {
    return {
        type: SET_SEARCH_VALUE,
        payload,
    };
};

export const setSearchCategory = (payload) => {
    return {
        type: SET_SEARCH_CATEGORY,
        payload,
    };
};
