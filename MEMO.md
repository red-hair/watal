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

```
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


