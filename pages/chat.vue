<template>
  <div>
    <!-- {{this.store.state.user}} -->
    <button @click="signOutGoogle">ログアウト</button>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase";

export default {
  methods: {
    signOutGoogle() {
      this.$store.dispatch("signOutGoogle");
      this.$router.push("/logIn");
    }
  }
};
</script>

<style>
</style>