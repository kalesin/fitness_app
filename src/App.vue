<template>
  <app-home v-if="!loggedIn"></app-home>
  <v-app v-else>
    <!-- <v-app-bar app>
    </v-app-bar>-->

    <app-header></app-header>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";
import Home from "./components/Home.vue";

import { mapActions, mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
    };
  },
  computed: {
...mapState("firebase", ["password", "email", "loggedIn", "userData"]),
  },
  components: {
    appHeader: Header,
    appHome: Home
  },
  created() {}
};
</script>

<style>
.v-application--wrap.v-application--wrap {
  flex-direction: row;
}

.slide-enter-active {
  animation: slide-in 200ms ease-out forwards;
}
.slide-leave-active {
  animation: slide-out 200ms ease-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0px);
    opacity: 1;
  }
  to {
    transform: translateY(-30px);
    opacity: 0;
  }
}
</style>
