<template>
  <div>
    <li v-for="(message, i) in messages" :key="i">
      <ul>{{ message.name }}</ul>
      <ul>{{ message.msg }}</ul>
      <ul>{{ message.date }}</ul>
      <img :src="message.photoURL" width="40" height="40" />
    </li>
    <!-- <new-message /> -->
  </div>
</template>

<script>
import NewMessage from "@/components/Chat/NewMessage";
import firebase from "@/plugins/firebase";

const db = firebase.firestore();
export default {
  name: "Chat",
  components: {
    NewMessage
  },
  data() {
    return {
      messages: []
    };
  },
  created() {
    let ref = db
      .collection("rooms")
      .doc("roomA")
      .collection("messages");
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == "added") {
          let doc = change.doc;
          this.messages.push({
            id: doc.id, //idをaddで自動追加しているのでdocの引数にidを取れないから書かなくても良いのかも？
            name: doc.data().name,
            msg: doc.data().msg,
            date: doc.data().date,
            photoURL: doc.data().photoURL,
            uid: doc.data().uid
          });
        }
      });
      //   console.log("snapshot.docChanges()", snapshot.docChanges());
    });
  }
};
</script>

<style>
</style>