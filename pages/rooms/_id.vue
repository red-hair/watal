<template>
  <div>
    <header class="header">
      <h1>Chat</h1>
      <!-- ログイン時にはフォームとログアウトボタンを表示 -->
      <div v-if="currentUser.uid" key="login">
        [{{ currentUser.displayName }}]
        <button type="button" @click="signOutGoogle">ログアウト</button>
      </div>
      <!-- 未ログイン時にはログインボタンを表示 -->
      <div v-else key="logout">
        <button type="button" @click="doLogin">ログイン</button>
      </div>
      <!-- room一覧に戻る -->
      <div>
        <nuxt-link to="/room-test">
          <button>Back to room list</button>
        </nuxt-link>
      </div>
    </header>

    <!-- Firebaseから取得したリストを描画(トランジション付き) -->
    <transition-group name="chat" tag="div" class="list content">
      <section
        v-for="message in chat"
        :key="message.id"
        :class="[message.name === currentUser.displayName ? 'message-own' : 'message']"
      >
        <div class="item-image">
          <img :src="message.image" width="40" height="40" />
        </div>
        <div class="item-detail">
          <div class="item-name">{{ message.name }}</div>
          <div
            :class="[message.name === currentUser.displayName ? 'item-message-own' : 'item-message']"
          >
            <nl2br tag="div" :text="message.message" />
          </div>
        </div>
      </section>
    </transition-group>

    <!-- 入力フォーム -->
    <form action @submit.prevent="doSend" class="form">
      <textarea
        v-model="input"
        required="true"
        :disabled="!currentUser.uid"
        @keydown.enter.shift.exact.prevent="doSend"
      ></textarea>
      <!-- shift + enter が押された時も doSendが呼ばれる -->
      <button type="submit" :disabled="!currentUser.uid" class="send-button">Send</button>
    </form>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase";
import Nl2br from "vue-nl2br";
// import { mapState } from "vuex";
import moment from "moment"; //timestampを任意の形で表示するためのモジュール

const db = firebase.firestore();

export default {
  components: { Nl2br },
  //   name: "Chat",
  data() {
    return {
      user: {}, //ユーザー情報
      chat: [], //取得したメッセージを入れる配列
      input: null //v-modelの入力フォームの初期値
      // feedback: null //入力したメッセージ
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    }
  },
  created() {
    const ref = db
      .collection("rooms")
      .doc(this.$route.params.id)
      .collection("messages")
      .orderBy("date");
    ref.onSnapshot(snapshot => {
      console.log("snapshot", snapshot);
      snapshot.docChanges().forEach(change => {
        console.log("change", change);
        if (change.type === "added") {
          let doc = change.doc;
          this.chat.push({
            id: doc.id,
            name: doc.data().name,
            message: doc.data().msg,
            date: moment(doc.data().date).format("lll"),
            image: doc.data().photoURL,
            uid: doc.data().uid
          });
        }
      });
      this.scrollBottom(); //さっき定義した関数を処理後に呼び出す
      // onSnapshotの処理の範囲内なら再レンダリングされた時もスクロールが効く
    });
    console.log("this.chat", this.chat);
  },
  // },
  methods: {
    // googleログイン認証のため、userにセットされる値が違うためエラーが出るかも
    async doLogin() {
      await this.$store.dispatch("logInGoogle");
    },
    signOutGoogle() {
      this.$store.dispatch("signOutGoogle");
      this.$router.push("/logIn");
    },
    // ログアウト処理
    doLogout() {
      firebase.auth().signOut();
    },
    // スクロール位置を一番下に移動
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight);
      });
    },
    doSend() {
      if (this.input) {
        db.collection("rooms")
          .doc(this.$route.params.id)
          .collection("messages")
          .add({
            msg: this.input,
            name: this.currentUser.displayName,
            date: Date.now(),
            photoURL: this.currentUser.photoURL,
            uid: this.currentUser.uid
          })
          .catch(err => {
            console.log("err", err);
          });
        this.input = null;
        // this.feedback = null;
      } else {
        // this.feedback = "※メッセージを入力して下さい";
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  box-sizing: border-box;
}
.header {
  background: #3ab383;
  margin-bottom: 1em;
  padding: 0.4em 0.8em;
  color: #fff;
}
.content {
  margin: 0 auto;
  padding: 0 10px;
  max-width: 600px;
}
.form {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  height: 80px;
  width: 100%;
  background: #f5f5f5;
}
.form textarea {
  border: 1px solid #ccc;
  border-radius: 2px;
  height: 4em;
  width: calc(100% - 6em);
  resize: none;
}
.list {
  margin-bottom: 100px;
}
.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.8em;
}
.item-image img {
  border-radius: 20px;
  vertical-align: top;
}
.item-detail {
  margin: 0 0 0 1.4em;
}
.item-name {
  font-size: 75%;
}
/* chat相手の吹き出し */
.item-message {
  position: relative;
  display: inline-block;
  padding: 0.8em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
}
.item-message::before {
  position: absolute;
  content: " ";
  display: block;
  left: -16px;
  bottom: 12px;
  border: 4px solid transparent;
  border-right: 12px solid #deefe8;
}
/* currentUser用の吹き出し */
.item-message-own {
  position: relative;
  display: inline-block;
  padding: 0.8em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
}
.item-message-own::before {
  position: absolute;
  content: " ";
  display: block;
  right: -16px;
  bottom: 12px;
  border: 4px solid transparent;
  border-left: 12px solid #deefe8;
}
.send-button {
  height: 4em;
}
/* トランジション用スタイル */
.chat-enter-active {
  transition: all 1s;
}
.chat-enter {
  opacity: 0;
  transform: translateX(-1em);
}
.message {
  margin-bottom: 3px;
}
.message-own {
  text-align: right;
  margin-bottom: 3px;
}
.message-own .content {
  background-color: lightskyblue;
}
.red-text {
  color: red;
}
</style>