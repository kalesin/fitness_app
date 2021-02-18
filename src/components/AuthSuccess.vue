<template>
  <v-app>
    <app-header class="header"></app-header>
    <router-view class="router pa-3"></router-view>
  </v-app>
</template>

<script>
import firebase from "firebase";
import Header from "./Header";

import { mapActions, mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState("firebase", [
      "password",
      "email",
      "loggedIn",
      "userData",
      "userID"
    ])
  },
  created() {
    var user = firebase.auth().currentUser;
    console.log(firebase.auth(), "authsuccess");
    if (user) {
      console.log("set user");
      this.user = user;
    }
  },
  data() {
    return {
      photo: "",
      userId: "",
      name: "",
      user: {}
    };
  },
  components: {
    appHeader: Header
  },
  methods: {
    ...mapActions("firebase", ["setUserID", "getData"])
  }
};
</script>

<style scoped>
.header {
  width: 250px !important;
}
.router {
  width: calc(100vw - 250px) !important;
  height: 100vh !important;
}
@media only screen and (max-width: 1300px) {
  .header {
    width: 58px !important;
  }
  .router {
    width: calc(100vw - 58px) !important;
  }
}

</style>
