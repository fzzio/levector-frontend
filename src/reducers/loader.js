const default_loader = {
    show: false
}
const loader = (state = default_loader, action) => {
    switch (action.type) {
        case 'SHOW_LOADER':
            return {show: true}
        case 'HIDE_LOADER':
            return {show: false};
        case 'GET_LOADER':
            // console.log('calling get loader');
            return state;
        default:
            return state
    }
}
export default loader