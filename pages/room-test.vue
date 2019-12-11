<template>
  <v-app>
    <div>
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12">
              <ul>
                <li v-for="room in rooms" :key="room.id">
                  <nuxt-link :to="{ name: 'chat-id', params: { id: room.id } }">
                    <span>{{ room.name }}</span>
                  </nuxt-link>
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <form action @submit.prevent="createNewRoom">
        <label for="New room">New room</label>
        <input type="text" v-model="room_name" />
      </form>
    </div>
  </v-app>
</template>

<script>
import firebase from "@/plugins/firebase";

const db = firebase.firestore();

export default {
  data() {
    return {
      rooms: [],
      room_name: ""
      // roomId: this.$route.query.chatroomId || ""
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    }
  },
  methods: {
    createNewRoom() {
      db.collection("rooms")
        .add({
          name: this.room_name
        })
        .then(ref => {
          console.log("Document written with ID", ref.id);
        })
        .catch(function(err) {
          console.error("Error adding document", error);
        });
    }
  },
  created() {
    // TODO: onSnapshotを用いたrealtime listeningに切り替える
    db.collection("rooms").onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        console.log("change", change);
        this.rooms.push({
          id: change.doc.id,
          name: change.doc.data().name
        });
      });
    });
    console.log("this.rooms", this.rooms);
  }
};
</script>

<style>
</style>