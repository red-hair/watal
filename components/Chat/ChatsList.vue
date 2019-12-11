<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div>
            <ul class="messages" v-chat-scroll>
              <li v-for="message in messages" :key="message.id">
                <span>{{ message.name }}</span>
                <span>{{ message.msg }}</span>
                <span>{{ message.date }}</span>
                <img :src="message.photoURL" width="40" height="40" />
              </li>
            </ul>
            <!-- <new-message /> -->
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import NewMessage from "@/components/Chat/NewMessage";
import firebase from "@/plugins/firebase";
import moment from "moment";
import VueChatScroll from "vue-chat-scroll";

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
      .collection("messages")
      .orderBy("date");
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == "added") {
          let doc = change.doc;
          this.messages.push({
            id: doc.id, //idをaddで自動追加しているのでdocの引数にidを取れないから書かなくても良いのかも？
            name: doc.data().name,
            msg: doc.data().msg,
            date: moment(doc.data().date).format("lll"),
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

<style scoped>
.messages {
  max-height: 300px;
  overflow: auto;
}
.messages::-webkit-scrollbar {
  width: 3px;
}
.messages::-webkit-scrollbar-track {
  background: #bbb;
}
.messages::-webkit-scrollbar-thumb {
  background: #aaa;
}
</style>