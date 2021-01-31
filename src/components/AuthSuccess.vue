<template>
 <v-app>
      <app-header></app-header>
          <router-view class="router"></router-view>
    </v-app>
</template>

<script>
import firebase from "firebase";
import Header from "./Header";

import { mapActions, mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState("firebase", ["password", "email", "loggedIn", "userData", "userID"])
  },
  created() {
    var user = firebase.auth().currentUser;
    console.log(firebase.auth(), "authsuccess")
    if (user) {
      console.log("set user")
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
.v-navigation-drawer {
  width: 13vw !important;
}
.router {
  width: calc(100vw - 13vw) !important;
}
</style>
