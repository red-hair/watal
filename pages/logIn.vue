<template>
  <div>
    <button @click="logInGoogle">Google認証</button>
  </div>
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