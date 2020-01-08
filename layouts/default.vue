<template　v-slot:prepend>
  <div>
  <header class="header">
    <v-layout>
          <!-- <v-flex xs12 sm6 md4 text-center my-5> -->
    <v-container>  <!-- グリッド -->
  <v-row
      class="mb-6"
      no-gutters
    >
  <v-col class="ms-3">
            <img class="logo" src="@/assets/logo.png">
  </v-col>
          <!-- </v-flex> -->
          <!-- <v-flex xs12 sm6 md4 text-center my-5></v-flex> -->
          <!-- <v-flex xs12 sm6 md4 text-center my-5> -->
   <v-col class="ms-3">
            <div v-if="currentUser.uid" key="login">
              [{{currentUser.displayName}}]
              <!-- v-onと@一緒 -->
              <button type="button" @click="signOutGoogle">ログイン</button>
            </div>
            <div v-else key="logout">
              <button type="button" @click="doLogin">"ログイン</button>
            </div>
          <!-- </v-flex> -->
    </v-col>
    </v-row>
    </v-container>  <!-- グリッド終わり -->  
        </v-layout>
    </header>
    
    <div v-if="loading">
      <loading />
    </div>
    <div v-if="currentUser">
      <nuxt />
    </div>


    
  </div>
</template>

<script>

import firebase from "@/plugins/firebase";
import Loading from "@/components/Loading";
import { mapState } from "vuex";
export default {
  components: { Loading },
  data() {
    return {
      user: {},
      baseUrl: process.env.BASE_URL
      // isLoading: true
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.state.loading;
    }
  }
};
</script>

<script>
import firebase from "@/plugins/firebase";
import Nl2br from "vue-nl2br";
// import { mapState } from "vuex";

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
    //基本的な関数を入れて置く場所
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
      //   let vm = this;
      const message = snap.val();
      //chatは最初空配列
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

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.logo {
  height: 50px;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
