const initialState = {
    isLogin : localStorage.getItem('secret_token')? true: false,
    secret_token:localStorage.getItem('secret_token')?localStorage.getItem('secret_token'):''
};



function mainReducer(state = initialState, action) {
    switch(action.type) {
    case 'LOGIN':
        localStorage.setItem('secret_token', action.value);
        return {
            ...state,
            secret_token:localStorage.getItem('secret_token'),
            isLogin: true,

        };
    case 'LOGOUT':
        localStorage.removeItem('secret_token');
        return {
            ...state,
            isLogin: false,
        }
        default:
        return state;
    }
  }
  
  export default mainReducer;
  