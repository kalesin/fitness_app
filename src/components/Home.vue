<template>
  <div>
    <div v-if="!clickedSignIn && !clickedRegister">
      <v-btn color="success" class="mr-4" @click="clickedSignIn=true">Sign In</v-btn>
      <v-btn color="error" class="mr-4" @click="clickedRegister=true">Register</v-btn>
    </div>

    <v-form v-if="clickedSignIn" ref="form" lazy-validation label="Sign In">
      <v-text-field v-model="email" label="E-mail" required></v-text-field>
      <v-text-field v-model="password" type="password" label="Password" required></v-text-field>
      <v-btn color="success" class="mr-4" @click="signIn">Sign In</v-btn>
    </v-form>
    <v-form v-if="clickedRegister" ref="form" lazy-validation label="Register">
      <v-text-field v-model="email" label="E-mail" :rules="emailRules" required></v-text-field>
      <v-text-field v-model="password" type="password" label="Password" :rules="passwordRules" required></v-text-field>
      <v-btn color="error" class="mr-4" @click="register">Register</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { auth, db } from "../scripts/auth.js";

export default {
  data() {
    return {
      password: "",
      email: "",
      clickedSignIn: false,
      clickedRegister: false,
      passwordRules: [
        v => !!v || "Password is required",
        v => v.split(" ").length < 2 || `Password can't contain spaces`,
        v => (v && v.length >= 6) || "Password must be more than 6 characters",
        v =>
          v
            .split("")
            .map(a => parseFloat(a))
            .filter(a => !Number.isNaN(a)).length > 0 ||
          "Password must contain atleast 1 number"
        /* v => v.split('').filter(a=>a==a.toUpperCase()&&!(a.toUpperCase()==a.toLowerCase())).length > 0 || 'Password must contain atleast 1 uppercase character', */
      ],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  computed: {
   ...mapState("firebase", ["loggedIn", "userData", "userID"]),
  },
  methods: {
    ...mapActions("firebase", [
      "setPassword",
      "setEmail",
      "setLoggedIn",
      "setUserID"
    ]),
    register() {
      this.setPassword(this.password);
      this.setEmail(this.email);
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(cred => {
          console.log(cred.user);
        });
    },
    signIn() {
      this.setPassword(this.password);
      this.setEmail(this.email);
      auth.signInWithEmailAndPassword(this.email, this.password).then(cred => {
        console.log(cred.user);
        this.setLoggedIn(true);
        this.setUserID(cred.user.uid);
      });
      this.$router.push("calories");
    }
  }
};
</script>