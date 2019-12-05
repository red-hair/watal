<template>
  <div>
    <section v-if="isChat">
      <!-- 入力フォーム -->
      <form action @submit.prevent="sendMessage" class="form">
        <textarea v-model="input" :disabled="!user"></textarea>
        <button type="submit" :disabled="!user" send-button>送信</button>
      </form>

      <!-- トランジション -->
      <transition-group name="chat" tag="div" class="list content">
        <section
          v-for="{ key , name ,image, message, isFromGuest } in chat"
          :key="key"
          class="item"
        >
          <div class="item-image">
            <img :src="image" width="40" height="40" />
          </div>
          <div class="item-detail">
            <div class="item-name"></div>
            <div class="item-message">
              <nl2br tag="div" :v-text="message" />
            </div>
          </div>
        </section>
      </transition-group>
    </section>

    <section v-else>
      <the-root
        root
        :user="user"
        :chats="chats"
        :authPending="authPending"
        :clickHandler="signInTwitter"
      ></the-root>
    </section>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase";

export default {
  components: { TheRoot, Nl2br },
  data() {
    return {
      authPending: true,
      user: null,
      chats: [],
      chat: [],
      input: "",
      isChat: false,
      isGuest: false,
      key: ""
    };
  },
  beforeCreate() {
    firebase.auth().onAuthStateChanged(async user => {
      this.authPending = false;
      this.user = user;
      if (user) {
        const refUser = firebase.database().ref("users/" + this.user.uid);
        await refUser.child("name").set(user.displayName);
        const userSnap = await refUser.once("value");
        this.user.chats = userSnap.val().chats;
      }
      const url = new URL(location.href);
      this.chatUid = url.searchParams.get("chatUid");
      this.isChat = !!this.chatUid;
      for (let chatUid of Object.keys(this.user.chats)) {
        const refChats = firebase.database().ref("chats/" + chatUid);
        refChats.once("value", snap => {
          const newChat = snap.val();
          this.chats.push({
            ...newChat,
            uid: chatUid,
            isCreator: this.user.chats[chatUid] === "creator"
          });
        });
      }
      if (!user) {
        if (this.isChat) {
          alert("ログインして下さい");
          return this.signInTwitter();
        }
        return;
      }
      if (!this.isChat) {
        return;
      }
      const ref_messages = firebase.database().ref("messages/" + this.chatUid);
      this.chat = [];
      const refUsers = firebase
        .database()
        .ref("users/" + this.user.uid + "/chats/" + this.chatUid);
      refUsers.once("value", snap => {
        this.isGuest = snap.val() === "guest";
      });
      ref_message.limitTolast(100).on("child_added", this.childAdded, e => {});
    });
  },
  created() {
    const url = new URL(location.href);
    this.chatUid = url.searchParams.get("chatUid");
    this.isChat = !!this.chatUid;
    if (!this.isChat) {
      return;
    }
    if (+url.searchParams.get("expireAt") < Date.now()) {
      alert("有効期限が過ぎています");
      return (window.location = "/");
    }
  },
  mounted() {
    const authUser = Object.keys(window.localStorage).filter(item =>
      item.startsWith("firebase:host:watal.firebaseio.com")
    )[0];
    if (!authUser) {
      this.authPending = false;
    }
  },
  methods: {
    // ログイン処理
    // スクロール位置を一番下に移動
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight);
      });
    },
    sendMessage() {
      firebase
        .database()
        .ref("messages/" + this.chatUid)
        .push(
          {
            // FIXME: 下記の三項演算子のURLはコピペしたやつなので書き換える必要有り
            image: this.isGuest
              ? "https://firebasestorage.googleapis.com/v0/b/necocha-io.appspot.com/o/animal_mark04_neko.png?alt=media&token=ba4e9920-bf1f-45ea-a3e6-0a34e3a85b21"
              : this.user.photoURL,
            message: this.input,
            isFromGuest: this.isGuest
          },
          () => {
            this.input = ""; //フォームを空にする
          }
        );
    },
    childAdded(snap) {
      const message = snap.val();
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message,
        isFromGuest: message.isFromGuest
      });
      this.scrollBottom();
    },
    signInTwitter() {
      const providerTwitter = new firebase.auth.GoolgeAuthProvider();
      firebase.auth().signInWithRedirect(providerTwitter);
    }
  }
};
</script>

<style>
</style>