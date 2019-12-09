import firebase from '@/plugins/firebase'

const actions = {
    logInGoogle({ commit }) {
        const provider = new firebase.auth.GoogleAuthProvider();
        let vm = this;
        firebase.auth().signInWithPopup(provider).then(function (res) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // let token = res.credential.accessToken;
            // The signed-in user info.
            commit('setUser', res.user)
            vm.$router.push('/chat');
            // let user = res.user;
            // ...
        }).catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;
            // ...
            if (errorCode) {
                console.log(errorCode)
            } else if (errorMessage) {
                console.log(errorMessage)
            } else if (email) {
                console.log(email)
            } else if (credential) {
                console.log(credential)
            }
        });
    },
    signOutGoogle({ commit }) {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            commit("setUser", { id: 0 })
        }).catch(function (error) {
            // An error happened.
        });
    },
    authCheck({ commit }) {
        firebase.auth().onAuthStateChanged(user => {
            commit("setUser", user)
            commit("changeLoading", false)
        })
    }
}

export default actions;