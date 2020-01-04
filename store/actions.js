//メソッド
//メソッドでコミットしたい
//vuex グローバルな値を扱う　セット
//認証しにfirebaseにアクセス　responseをコミットする
//コミット先はsetUser
//seiUserはmutations
import firebase from '@/plugins/firebase'

const actions = {
    logInGoogle({ commit }) {
        const provider = new firebase.auth.GoogleAuthProvider();
        let vm = this;
        firebase.auth().signInWithPopup(provider).then(function (res) {
            commit('setUser', res.user)
            vm.$router.push('/chat');
        }).catch(function (error) {
            console.log("error", error);
        });
    },
    signOutGoogle({ commit }) {
        firebase.auth().signOut().then(function () {
            commit("setUser", { id: 0 })
        }).catch(function (error) {
            console.log("error", error);
        });
    }
}

export default actions;
