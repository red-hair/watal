<template>
  <div>
  <v-container>  <!-- グリッド -->
  <v-row>
  <v-col cols="ms-3">
          <!-- <v-card> -->
          <v-navigation-drawer
            app clipped fixed v-model="leftDrawer" :mini-variant="leftMiniVariant" expand-on-hover
      permanent
          >
          <!-- <template v-slot:prepend> -->
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item
            link
            two-line
          >
            <v-list-item-content>
              <v-list-item-title class="title">Sandra Adams</v-list-item-title>
              <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-menu-down</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
<!-- </template> -->
    </v-navigation-drawer>
    <!-- </v-card> -->
</v-col>

<v-col class="ms-9">
    <!-- <div class="container"> -->
        <img class="fish" src="@/assets/fish2.png">
        <img class="fish2" src="@/assets/fish2re.png">
        <img class="fish3" src="@/assets/fish2.png">

        <div class="bubbles">
          <div class="bubble"></div>
          <div class="bubble"></div>
          <div class="bubble"></div>
          <div class="bubble"></div>
          <div class="bubble"></div>
        </div>
      <transition-group name="chat" tag="div" class="list content">
        <!-- : = v-bind はhtmlの属性に対して使える-->
        <section
          v-for="{ key, name, image, message} in chat"
          :key="key"
          :class="[name === currentUser.displayName ? 'message-own' : 'message' ]"
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
    <!-- </div> -->
  </v-col>
    </v-row>
    </v-container>  <!-- グリッド終わり -->

    <form action @submit.prevent="doSend" class="form">
      <!-- 入力系はv-model -->
      <!-- enter.exactはenter押した時だけ -->
      <textarea v-model="input" :disabled="!currentUser.uid" @keydown.enter.exact.prevent="doSend"></textarea>
      <button type="submit" :disabled="!currentUser.uid" class="send-button">Send</button>
    </form>
  </div>
</template>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

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

<style lang="scss" scoped>
  /* #99CCFF・・・水色 */
* {
  margin: 0;
  box-sizing: border-box;
}



// fishアニメーション
.fish{
  height: 30px;
  animation-name: fish;
  animation-duration: 20s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-direction: normal;
}
.fish2{
  height: 30px;
  animation-name: fish2;
  animation-duration: 30s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-direction: normal;
}
.fish3{
  height: 30px;
  animation-name: fish3;
  animation-duration: 25s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-direction: normal;
}

@keyframes fish {
  0% {
    transform: translate(1200px,0px);
    opacity: 0.6;
  }
  50% {
    transform: translate(500px,-5px);
    opacity: 1;
  }
  100% {
    transform: translate(-100px,0px);
    opacity: 0;
  }
}
@keyframes fish2 {
  0% {
    transform: translate(-100px,90px);
    opacity: 0.6;
  }
  50% {
    transform: translate(300px,85px);
    opacity: 1;
  }
  100% {
    transform: translate(900px,90px);
    opacity: 0;
  }
}
@keyframes fish3 {
  0% {
    transform: translate(900px,190px);
    opacity: 0.6;
  }
  50% {
    transform: translate(300px,185px);
    opacity: 1;
  }
  100% {
    transform: translate(-100px,190px);
    opacity: 0;
  }
}
// fishアニメーションここまで

// 泡アニメーション
.bubble {
position: absolute;
bottom: -40;
width: 20px;
height: 20px;
background-color: transparent;
border: 1px solid #fff;
border-radius: 50%;
animation: bubble 10s ease-in infinite;
opacity:0.6;
}
 
.bubble:nth-child(1) {
width: 20px;
height: 20px;
left: 30%;
animation-duration: 20s;
}
 
.bubble:nth-child(2) {
left: 20%;
animation-duration: 20s;
}
 
.bubble:nth-child(3) {
width: 30px;
height: 30px;
left: 30%;
animation-duration: 30s;
}
 
.bubble:nth-child(4) {
width: 50px;
height: 50px;
left: 67%;
animation-duration: 25s;
}
 
.bubble:nth-child(5) {
width: 20px;
height: 20px;
left: 70%;
animation-duration: 40s;
}
 
@keyframes bubble {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translateX(100px);
  }
  100% {
    bottom: 20000px;
  }
}
// 泡アニメーションここまで




.container {
  /* #99CCFF・・・水色 */
  background: #99CCFF;
}

.header {
  background: #fff;
  /* margin-bottom: 1em; */
  padding: 0.4em 0.8em;
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
  background: #75A9FF;
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
  border-right: 12px solid #75A9FF;
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


@media screen and (min-width: 960px){
.container {
    max-width: 100%;
}
}
</style>