<template>
  <v-navigation-drawer permanent>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Fitness App</v-list-item-title>
        <v-list-item-subtitle>"shred city"</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <router-link
      v-for="item in logout"
      :key="item.title"
      :to="item.url"
      activeClass="active"
      tag="div"
    >
      <v-list-item link @click="signOut()">
        <v-list-item-icon>
          <v-icon class="active-icon">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="active-text">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </router-link>

    <v-divider></v-divider>

    <v-list dense nav>
      <router-link
        v-for="item in items"
        :key="item.title"
        :to="item.url"
        activeClass="active"
        tag="div"
      >
        <v-list-item link>
          <v-list-item-icon>
            <v-icon class="active-icon">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content class="active-text">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import {auth, db} from '../scripts/auth.js'

export default {
  data() {
    return {
      items: [
        { title: "My Account", icon: "mdi-account-circle", url: "/myaccount"},
        { title: "Daily Entry", icon: "mdi-food-apple-outline", url: "/calories" },
        { title: "My Recipes", icon: "mdi-food-fork-drink", url: "/recipes" },
        { title: "Calendar of Daily Entries", icon: "mdi-calendar-multiselect", url: "/calendar" },
      ],
      logout: [
{ title: "Log Out", icon: "mdi-login", url: "/home" },
      ],
      right: null,
      isDropdownOpen: false
    };
  },
  computed: {
   ...mapState("firebase", ["password", "email", "loggedIn", "userData", "userID"]),
  },
  methods: {
    ...mapActions("firebase", [
      "setPassword",
      "setEmail",
      "setLoggedIn",
      "setUserID"
    ]),
    signOut() {
      auth.signOut().then(()=>{
        console.log("user has logged out")
        this.setLoggedIn(false);
      })
    }
  }
};
</script>

<style scoped>
.active {
  background-color: gray;
}
.active .active-text > div {
  color: rgb(204, 204, 204);
  font-weight: 900;
}
.active .active-icon {
  color: rgb(204, 204, 204);
}
</style>