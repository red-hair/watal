<template>
  <v-app>
    <button @click="logInGoogle">Google認証</button>
  </v-app>
</template>

<script>
import firebase from "@/plugins/firebase";

export default {
  methods: {
    logInGoogle() {
      this.$store.dispatch("logInGoogle");
      this.$router.push("/chat");
    }
  }
};
</script>

<style>
</style>