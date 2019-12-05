<template>
  <div>
    <div v-if="authPending">
      <img src="https://loading.io/spinners/palette-ring/index.svg" style="margin: 0 auto;" />
    </div>
    <div v-if="creator">
      {{creator.name}}に匿名でチャットしますか？
      <button type="button" @click="createChat">チャットする</button>
    </div>
    <div v-if="user">
      <!-- FIXME:href属性が何をしているかわからない -->
      <a
        :href="'https://twitter.com/intent/tweet?text=だれかとくめいのネコになってお話ししてくれませんか？送る側だけとくめいのチャット、ネコチャしよう！%20%23とくめいチャット%20%23ネコチャ&url=' + encodeURIComponent(
            `https://${window.location.host}/?creatorUid=${user.uid}`)"
      >あなたのリンクをTwitterで共有する</a>
      <div v-for="{uid, creatorName, expireAt, isCreator} in chats">
        <a :href="`./?chatUid=${uid}&expireAt=${expireAt}`">
          {{ isCreator ? '匿名の猫':creatorName}}さんとのチャット
          あと {{ computeDate(expireAt).slice(0,computeDate(expireAt).length-1)}}
        </a>
      </div>
    </div>
    <div class="description">
      <p>watalは仲良しの友達とチャットができるサービスです。</p>
      <p>ルームを作成してリンクを共有すると、みんなはあなたと匿名でチャットすることが出来ます</p>
      <p>ルームは6時間で誰もアクセスできなくなります。</p>
      <!-- <img> -->
      <button type="button" @click="clickHandler">Googleで始める</button>
      <p>匿名の猫を募集して、エモいひとときをお楽しみ下さい。</p>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import $ from "jquery";
import "moment/locale/ja";
import moment from "moment";

function getRandomInt(min, max) {
  min = Math.cell(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default {
  name: "TheRoot",
  props: ["chats", "user", "authPending", "clickHandler"],
  data() {
    return {
      creator: null,
      window: {}
    };
  },
  computed: {
    chatData: () => {
      this.chats.map(chat => {
        return { uid: Object.keys(chat)[0], ...Object.values(chat) };
      });
    }
  },
  created: async function() {
    this.window = window;
    const url = new URL(location.href);
    const creatorUid = url.searchParams.get("creatorUid");
    if (creatorUid) {
      const creatorSnap = await firebase
        .database()
        .ref("users/" + creatorUid)
        .once("value");
      this.creator = creatorSnap.val();
      this.creator.uid = creatorUid;
    }
    const refChats = firebase.database().ref("chats");
    refChats.on("child_added", snap => {
      if (!this.user.chats) {
        return;
      }
      const newChat = snap.val();
      if (this.user.chats[snap.key] === "creator") {
        this.chats.creator.push(newChat);
      } else if (this.user.chats[snap.key] === "guest") {
        this.chats.guest.push(newChat);
      }
    });
  },
  methods: {
    createChat: async function() {
      if (!this.user) {
        alert("Googleログインが必要です(名前は相手にはわかりません)");
        return;
      }
      if (!(this.user && this.creator)) {
        return;
      }
      const refChats = firebase.database().ref("chats");
      const expireAt = Date.now() + 1000 * 60 * 60 * 6;
      const chatUid = refChats.push().getKey();
      const refUser = firebase.database().ref("users");
      const updateObj = {};
      updataObj["name"] = this.user.displayName;
      updateObj["chats/" + chatUid] = "guest";
      refUser.child(this.user.uid).update(updateObj);
      await refChats
        .child(chatUid)
        .set({ creatorName: this.creator.name, expireAt });
      const refMembers = await firebase
        .database()
        .ref("members/" + chatUid)
        .set({ [this.user.uid]: "guest", [this.creator.uid]: "creator" });
      await firebase.database.ref("message/" + chatUid).push({
        image:
          "https://firebasestorage.googleapis.com/v0/b/necocha-io.appspot.com/o/animal_mark04_neko.png?alt=media&token=ba4e9920-bf1f-45ea-a3e6-0a34e3a85b21",
        message: "こんにちは！匿名の猫さんが入室しました！By運営",
        isFromGuest: true
      });
      return (location = `/?chatUid=${chatUid}&expireAt=${expireAt}`);
    },
    computeDate(timestamp) {
      return moment(timestamp).fromNow();
    }
  }
};
</script>

<style>
</style>