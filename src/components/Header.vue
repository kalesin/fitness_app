<template>
  <v-navigation-drawer permanent>
    <v-list-item class="avatar">
      <v-list-item-avatar>
        <v-img :src="`${user.photoURL}`" height="100px" contain position="left"></v-img>
      </v-list-item-avatar>
    </v-list-item>
    <v-list-item :class="{hide: hide}" id="hide">
      <v-list-item-content>
        <v-list-item-title class="title" style="font-size: 25px">Fitness App</v-list-item-title>
        <v-list-item-subtitle>Welcome, {{ user.displayName }}!</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <router-link
      v-for="item in logout"
      :key="item.title"
      :to="item.url"
      activeClass="active"
      tag="div"
    >
      <v-list-item link @click="logOut()">
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
import firebase from "firebase";

export default {
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  data() {
    return {
      items: [
        {
          title: "My Account",
          icon: "mdi-account-circle",
          url: "/user/myaccount"
        },
        {
          title: "Daily Entry",
          icon: "mdi-food-fork-drink",
          url: "/user/calories"
        },
        {
          title: "Calendar of Daily Entries",
          icon: "mdi-calendar-multiselect",
          url: "/user/calendar"
        }
      ],
      logout: [{ title: "Log Out", icon: "mdi-login", url: "/auth" }],
      right: null,
      isDropdownOpen: false,
      hide: false
    };
  },
  computed: {
    ...mapState("firebase", [
      "password",
      "email",
      "loggedIn",
      "userData",
      "userID",
      "user"
    ])
  },
  methods: {
    ...mapActions("firebase", [
      "setPassword",
      "setEmail",
      "setLoggedIn",
      "setUserID"
    ]),
    logOut() {
      firebase.auth().signOut();
    },
    myEventHandler(e) {
      if (window.innerWidth < 1300) {
        this.hide = true;
      } else {
        this.hide = false;
      }
    }
  }
};
</script>

<style scoped>
@media only screen and (max-width: 1300px) {
  .avatar {
    margin-left: 8px;
    margin-top: 4px;
    padding: 0;
  }
}
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