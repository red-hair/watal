<template>
  <div class="text-center">
    <!-- <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular> -->

    <!-- <v-progress-circular :width="3" color="red" indeterminate></v-progress-circular> -->

    <v-progress-circular class="circle" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>

    <!-- <v-progress-circular :width="3" color="green" indeterminate></v-progress-circular> -->

    <!-- <v-progress-circular :size="50" color="amber" indeterminate></v-progress-circular> -->
  </div>
</template>

<script>
export default {
  //   data() {
  //     return {
  //       user: {}
  //     };
  //   },
  //   async created() {
  //     await firebase.auth().onAuthStateChanged(user => {
  //       this.user = user ? user : { id: 0 };
  //       if (this.user === { id: 0 }) this.$router.push("/logIn");
  //       else {
  //         this.$store.commit("setUser", this.user);
  //       }
  //     });
  //   }
};
</script>

<style scoped>
.circle {
  width: 100vw;
  height: 100vh;
}
</style>