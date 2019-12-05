<template>
  <div>
    <loading v-if="isLoading" />
    <div>
      <nuxt />
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

export default {
  components: "loading",
  data() {
    return {
      user: {},
      isLoading: true
    };
  },
  async created() {
    await firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : { id: 0 };
      if (this.user === { id: 0 }) {
        this.isLoading = false;
        this.$router.push("/logIn");
      } else {
        this.$store.commit("setUser", this.user);
        this.isLoading = false;
      }
    });
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
