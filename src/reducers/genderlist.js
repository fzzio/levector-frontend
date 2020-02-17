const default_gender_list = []

const genderlist = (state = default_gender_list, action) => {
    switch (action.type) {
        case 'SET_GENDER_LIST':
            return action.payload;
        case 'GET_GENDER_LIST':
            return state;
        case 'RESET_GENDER_LIST':
            return default_gender_list;
        default:
            return state
    }
}
export default genderlist