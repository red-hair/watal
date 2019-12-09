<template>
  <v-app>
    <button @click="logInGoogle">Google認証</button>
  </v-app>
</template>

<script>
import firebase from "@/plugins/firebase";
// import beforeAuth from "@/layouts/beforeAuth";

export default {
  layout: "beforeAuth",
  methods: {
    logInGoogle() {
      this.$store.dispatch("logInGoogle");
    }
  }
};
</script>

<style>
</style>