<template>
  <form action @submit.prevent="addMessage">
    <label for="new-message">new message</label>
    <input type="text" name="new-message" v-model="newMessage" />
    <p class="red-text" v-if="feedback">{{ feedback }}</p>
  </form>
</template>

<script>
// import db from "@/plugins/firestore";
import firebase from "@/plugins/firebase";

export default {
  data() {
    return {
      newMessage: null,
      feedback: null
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    }
  },
  methods: {
    addMessage() {
      let db = firebase.firestore();
      if (this.newMessage) {
        db.collection("rooms")
          .doc("roomA")
          .collection("messages")
          .add({
            msg: this.newMessage,
            name: this.currentUser.displayName,
            date: Date.now()
          })
          .catch(err => {
            console.log("err", err);
          });
        this.newMessage = null;
        this.feedback = null;
      } else {
        this.feedback = " You must enter a message in order to send one";
      }
    }
  }
};
</script>

<style>
</style>