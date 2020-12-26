<template lang="html">
  <div id="firebaseui-auth-container"></div>
</template>

<script>
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "auth",
  mounted() {
    var google = new firebase.auth.GoogleAuthProvider();
    var email = new firebase.auth.EmailAuthProvider();
    var uiConfig = {
      signInFlow: "popup",
      signInSuccessUrl: "/user",
      signInOptions: [
        {
          provider: google.providerId,
          customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: "select_account"
          }
        },
        { provider: email.providerId,}
      ]
    };
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>