//ページが読み込まれるときに最初に読み込まれる
import firebase from "@/plugins/firebase";
export default (context) => {
    const { store } = context
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            store.commit("setUser", user)
            store.commit("changeLoading", false)
        }
    })
}