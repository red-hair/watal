//3のjsをぎゅ
import Vuex from 'vuex';
import mutations from "./mutations";
import state from './state';
import actions from './actions';

const store = () => {
    return new Vuex.Store({
        state,
        mutations,
        actions,
        getters: {
            user(state) {
                return state.user;
            }
        }
    });
}

export default store;