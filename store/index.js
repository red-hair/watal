import Vuex from 'vuex';
import mutations from "./mutations";
import state from './state';
import actions from './actions';
export const strict = false;

const store = () => {
    return new Vuex.Store({
        state,
        mutations,
        actions,
        getters: {
            user(state) {
                return state.user;
            },
            loading(state) {
                return state.loading;
            }
        }
    })
}
export default store;