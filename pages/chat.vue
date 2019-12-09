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
    </header>

    <!-- Firebaseから取得したリストを描画(トランジション付き) -->
    <transition-group name="chat" tag="div" class="list content">
      <!-- <section
        class="message"
        v-for="{ key, name, image, message } in chat"
        :key="key"
        :style="{ own: message.name === currentUser.displayName }"
      >-->
      <section
        v-for="{ key, name, image, message } in chat"
        :key="key"
        :class="[message.name === currentUser.displayName ? 'message-own' : 'message']"
      >
        <div class="item-image">
          <img :src="image" width="40" height="40" />
        </div>
        <div class="item-detail">
          <div class="item-name">{{ name }}</div>
          <div class="item-message">
            <nl2br tag="div" :text="message" />
          </div>
        </div>
      </section>
    </transition-group>

    <!-- 入力フォーム -->
    <form action @submit.prevent="doSend" class="form">
      <textarea v-model="input" :disabled="!currentUser.uid" @keydown.enter.exact.prevent="doSend"></textarea>
      <button type="submit" :disabled="!currentUser.uid" class="send-button">Send</button>
    </form>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase";
import Nl2br from "vue-nl2br";
import { mapState } from "vuex";

export default {
  components: { Nl2br },
  data() {
    return {
      // user: {}, //ユーザー情報
      chat: [], //取得したメッセージを入れる配列
      input: "" //入力したメッセージ
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    }
  },
  mounted() {
    // console.log("this.currentUser", this.currentUser);

    const ref_message = firebase.database().ref("message");
    if (this.currentUser) {
      this.chat = [];
      // messageに変更があったときのハンドラを登録
      ref_message.limitToLast(10).on("child_added", this.childAdded);
    } else {
      // messageに変更があったときのハンドラを解除
      ref_message.limitToLast(10).off("child_added", this.childAdded);
    }
    // console.log("this.childAdded", this.childAdded);
  },
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
    // 受け取ったメッセージをchatに追加
    // データベースに新しい要素が追加されると随時呼び出される
    childAdded(snap) {
      let vm = this;
      const message = snap.val();
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
      });
      console.log(
        "message.name === currentUser.displayName",
        message.name === this.currentUser.displayName
          ? "message-own"
          : "message"
      );
      this.scrollBottom(); //さっき定義した関数を処理後に呼び出す
    },
    doSend() {
      if (this.currentUser.uid && this.input.length) {
        let that = this;
        // firebaseにメッセージを追加
        firebase
          .database()
          .ref("message")
          .push(
            {
              message: this.input,
              name: this.currentUser.displayName,
              image: this.currentUser.photoURL
            },
            () => {
              that.input = ""; //フォームを空にする
            }
          );
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
/* .message {
  margin-bottom: 3px;
}
.message.own {
  text-align: right;
  margin-bottom: 3px;
}
.message.own .content {
  background-color: lightskyblue;
} */
</style>