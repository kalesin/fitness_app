<template>
<v-dialog v-model="show" max-width="500px">
  <v-card>

      <p style="padding:10px; font-size:20px;"> There already exists an entry for today. Want to overwrite?</p>
     
    <v-card-actions>
      <v-btn color="success" flat @click.stop="overwrite">Yes, Overwrite entry</v-btn>
      <v-btn color="error" flat @click.stop="show=false">No, Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>

import { mapActions, mapState, mapGetters } from 'vuex'

import dayjs from "dayjs";

export default {
  props: ['visible'],
  computed: {
      ...mapState("searchAndAdd", ["addedItems"]),
      ...mapState("firebase", ["userID"]),
      ...mapGetters("searchAndAdd", ["totalForToday"]),
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    },
    today() {
      return dayjs().format("YYYY-MM-DD");
    },
  },
  methods:{
      ...mapActions("other", ["overwriteDailyEntry"]),
      overwrite(){
          let object = {
              today: this.today,
              addedItems: this.addedItems,
              totalForToday: this.totalForToday
          }
          console.log(object)
          this.overwriteDailyEntry(object);
          this.updateAddedItems();
          this.updateUserDailyEntry();
          this.show=false;
      },
      updateAddedItems() {
      const data = {
        todaysItems: this.$store.state.searchAndAdd.addedItems
      };
      this.$http.patch("data/" + `${this.userID}` + ".json", data);
    },
    updateUserDailyEntry() {
      const userData = {
        dailyEntries: this.$store.state.other.dailyEntries
      };
      this.$http.patch("data/" + `${this.userID}` + "/userData.json", userData);
    }
  }
}
</script>

<style scoped>
.v-card__actions {
    justify-content: space-around;
    padding: 15px;
}
</style>