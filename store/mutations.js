const mutations = {
    setUser(state, payload) {
        state.user = payload
    },
    changeLoading(state, payload) {
        state.loading = payload
    }
}
export default mutations;