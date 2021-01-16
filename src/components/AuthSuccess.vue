<template>
 <v-app>
      <app-header style="width: 13%"></app-header>
          <router-view style="width: 87%"></router-view>
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
