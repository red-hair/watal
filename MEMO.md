# watalの開発メモ

## `【firebase.jsonの初期値(backup用)】`

```
{
  "database": {
    "rules": "database.rules.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## `【firebaseのインストール】`

```
firebase init
```

* 上記のコマンドを打つ前にfirebaseをプロジェクトにインストールする。

```
npm install firebase --save
```

---

## `【mapstateの使い方】`

[Qiita参考記事](https://qiita.com/Statham/items/046649bff81c00ba275e)

1. {mapstate}をscript内にimportすることでcomputedプロパティに記述するのが楽になる。
2. this.$store.state === state　と省略出来るようになる。
3. variable: "state内の値（例: "user"）" stateも記述の仕方次第で省略出来る。

```javascript
<script>
import { mapState } from "vuex";

export default {
  props: {
    localCount: Number // 親から渡されたprops
  },
  computed: mapState({
    // mapState内では、state === this.$store.state となる
    count1: state => state.count,
    // 書き方の問題で、
    // 以下も `state => state.count` と同じ意味になる
    count2: "count",
    // 普通のメソッドと同じで、this使いたい時はアロー関数ではダメで function で書く
    countPlusLocalState (state) {
      return state.count + this.localCount;
    }
  }),
  methods: {
    click: function () {
      // computed に mapState しておくことで、
      // メソッドからも $store.state.count とすることなく呼び出せる
      alert('count is ' + this.count2);
    }
  }
};
</script>
```
4. this使いたい時は`アロー関数はダメ`　＜＝　知らなかった...
5. thisを使いたいときはfunctionで書く！

### `mapの記述パターン集`

[Qiita参考記事](https://qiita.com/suin/items/7331905a45a8ff80d4dd)

1. モジュールごとに記述が別れるみたいなので、storeもクラシックでは無く、モジュールモードで作成するのが吉

---

## `【Vuexをクラシックモードからモジュールモードへ変更する方法】`

[Qiita参考記事](https://qiita.com/y-miine/items/028c73aa3f87e983ed4c)

* これから実装したら記述します！

---

## `【cssで画面中央に表示させる方法】`

[CSSでフルスクリーン(全画面) ＋ 縦横中央配置レイアウトを作る【3ステップ + おまけ】](https://mae.chab.in/archives/2749#post2749-1)

```
.class-name {
  width: 100vw;
  height: 100vh;
}
```

---

## `【dockerでimageが消せないときの対処法】`

`Error response from daemon: conflict: unable to delete 7be6a8478f5f (cannot be forced) - image has dependent child images`

1. 子供のイメージがあって消せないよ〜って言われる時の対処法

`for i in $(docker images -q); do  docker history $i | grep -q 7be6a8478f5f && echo $i; done | sort -u`

2. 上記のコマンドで子供イメージを検索出来る。

`docker rmi -f image名`

3. -fで強制削除オプションとなる。

---

## `【おのキャンのloadingコンポーネント参考記述】`

```javascript
<template>
  <div class="wrapper">
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
$theme-color: #25b290;
.wrapper {
  z-index: 1000;
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100%;
  background: rgba(107, 107, 107, 0.87);
}
.spinner {
  margin: 200px auto;
  width: 100px;
  height: 120px;
  text-align: center;
  font-size: 20px;
}
.spinner > div {
  background-color: $theme-color;
  height: 100%;
  width: 10px;
  display: inline-block;
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}
.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.spinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}
@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>
```

```javascript
<template>
  <div>
    <div v-if="loading">
      <loading></loading>
    </div>
    <div v-if="!mount">
      <mount></mount>
    </div>
    <div class="main" v-else>
      <div v-if="smallLoading">
        <small-loading></small-loading>
      </div>

      <div class="success">
        <success> {{message}} </success>
      </div>
      <nav-bar></nav-bar>
      <!-- PC用NavBar -->
      <div class="wrapper">
        <nuxt></nuxt>
        <div class="footer">
          <footer-bar></footer-bar>
        </div>
      </div>

      <smart-nav></smart-nav>
    </div>

  </div>
</template>

<script>
import Mount from "@/components/atoms/Mount";
import SmallLoading from "@/components/atoms/SmallLoading";
import Loading from "@/components/atoms/Loading";
import Success from "@/components/atoms/Success";
import NavBar from "@/components/atoms/NavBar";
import SmartNav from "@/components/atoms/SmartNav";
import FooterBar from "@/components/atoms/FooterBar";
import firebase from "../plugins/firebase";
import { magGetters } from "vuex";
import axios from "axios";
import { setTimeout } from "timers";

export default {
  components: {
    NavBar,
    Success,
    SmartNav,
    Mount,
    FooterBar,
    SmallLoading,
    Loading
  },
  data(){
    return {
      route: this.$route.params.path,
      token: null
    };
  },
  computed: {
    mount() {
      return this.$store.state.auth.mount;
    },
    message() {
      return this.$store.state.auth.message;
    },
    smallLoading() {
      return this.$store.state.smallLoading;
    }
  }
}

</script>
```


>pluginsのauthcheckedでしたっけ。あそこのauthStateChanged関数でstoreにuserをcommitした直後に
>store.commit('changeLoading', false)
>をする感じです。
>そうすればstoreにuserが入った後に,storeのloadingがfalseになり、
>default.vueで差し込んでるloadingコンポーネントのv-ifが外れてくれます。by おのキャン

*実際の記述で追記する必要あり*

---

## `【コンポーネント作成時の処理が行われる順番】`

1. asyncData
  * コンポーネントが呼ばれる前にDataの初期値がセットされる。
  * レンダリング前にデータをセットするためにasyncDataが使われる。
2. fetch
  * Dataがセットされた後にstoreに値がsetさせる
3. created
  * コンポーネント作成と同時にレンダリングが開始される。
  * ここでaxiosなどで値を取得しに行っても、レンダリングは待ってくれない（と思われる）
4. mounted
  * DOMがmountされる。レンダリングされてユーザーに一度createdでセットされた値が表示された後に処理が行われる
5. updated
  * v-modelなどでdataの値が書き換わったり、computedなどで値が更新されてDOMが更新される度にupdatedのライフサイクルが走る。
6. destroyed
  * ページ遷移を行うなど、DOMから離れた時に走るメソッド。リロードでは恐らく走らない。

---

## `【ローカルストレージ&セッションストレージ&キャッシュの違い】`

* セッションストレージ
  1. ブラウザのWindowが閉じられるまでの間、値を保持してくれる
  2. リロードされても値はリセットされない。
* ローカルストレージ
  1. Windowが閉じられても値を保持し続ける。
* 共通事項
  1. サーバー側で値を保持するため、ユーザが改ざん出来ない

* キャッシュ
  1. ブラウザが持つ様々な値
  2. スーパーリロードやキャッシュの削除など、ユーザー側で値を消去したり、変更を加える事ができる。

---

## `【firebaseのsnapshotとは？】`

スナップショットとは、ある時点における特定のデータベース参照にあるデータの全体像を写し取ったものです。スナップショットの val() / getValue() を呼び出すと、データの言語固有のオブジェクト表現が返されます。参照先の場所にデータが存在しない場合、スナップショットの値が null になります。Python の get() メソッドは、データの Python 表現を直接返します。Go の Get() 関数は、データを特定のデータ構造にアンマーシャリングします。[firebase公式より](https://firebase.google.com/docs/database/admin/retrieve-data?hl=ja)

---

## `【Firebase Cloud Firestoreの使い方】`

[Qiita参考記事](https://qiita.com/subaru44k/items/a88e638333b8d5cc29f2)

### Firestoreの基本的な用語

1. データ
  1. `key: value`

2. ドキュメント
  1. 連想配列、多次元連想配列(jsonのようなネスト構造) [多次元連想配列とは？](https://techacademy.jp/magazine/21621)
  2. サブコレクションも保持できる。
    * 多次元連想配列のkeyとして保持できる。
    * 多次元連想配列を行う際のkeyはサブコレクションじゃなくてもok!

連想配列(doc{data, data, data})
```document
key1: value1
key2: value2
key3: value3
```

多次元連想配列
```document
key1:
  key11: value11
  key12: value12
key2: value2
```

サブコレクション有りの多次元連想配列
```document
key1: value1
subcollection1: {
  document1
  document2
  document3
}
```

3. コレクション
  1. DBのルート(router.jsやroute.rbのようなイメージ)
  2. ドキュメントの集合体
  3. 配下のドキュメントは全て一意な名前を持つ
  4. ドキュメント作成時にコレクションも自動作成される
  5. ドキュメントが無くなれば自動破棄される。

```collection
users: {
  userdocument1
  userdocument2
  userdocument3
}
```

4. サブコレクション
  1. ドキュメント配下に存在するコレクション
  2. コレクション同様、ドキュメントを配下に取れる。
  3. ドキュメントとサブコレクションは交互に存在出来る。
    * ルート直下　=> コレクション
    * ドキュメント直下 => サブコレクション
  4. サブコレクションの親のドキュメントを削除しても、サブコレクションは破棄されない。手動で削除する必要有り。

### `dbの階層構造`

```
db
 ┗ collection
      ┗ document - data, data...
          ┗ sub collection(, sub collection...)
              ┗ document - data, data ...
```

### `リレーショナルなdbに置き換えて見ると？`

```案1
collection =
document = table
subcollection = record
data = column & value
```

```案2
collection = table
document = record
subcollection =
data = column & value
```

### 記事を読みながらメモ

* schemeがないため、columnをmergeしながら追加する事ができる
  * documentを作成時に値を追加(merge)して保存出来る

#### set() add()
* setはdocumentを作成してdataをsetする
  * 第2引数に{ merge: true }を渡すことで既存ドキュメントが存在する場合はdataを統合出来る
* add()
  * 一意なIDをドキュメント名に設定して追加(autoincrement)

#### res(docRef)
* documentを追加した後などは.thenでres(docRef)を受け取る事が可能。
  * async await対応は多分していない...


