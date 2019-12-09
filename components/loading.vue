<template>
  <v-app>
    <div class="text-center">
      <!-- <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular> -->

      <!-- <v-progress-circular :width="3" color="red" indeterminate></v-progress-circular> -->

      <v-progress-circular class="circle" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>

      <!-- <v-progress-circular :width="3" color="green" indeterminate></v-progress-circular> -->

      <!-- <v-progress-circular :size="50" color="amber" indeterminate></v-progress-circular> -->
    </div>
  </v-app>
</template>

<script>
export default {
  created() {
    console.log("loading");
  }
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
.v-progress-circular {
  margin: 1rem;
}
.circle {
  width: 100vw;
  height: 100vh;
}
</style>