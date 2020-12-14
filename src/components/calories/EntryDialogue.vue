<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <p
        style="padding:10px; font-size:20px;"
      >There already exists an entry for today. Want to overwrite?</p>

      <v-card-actions>
        <v-btn
          color="success"
          flat
          @click.stop="
      overwriteDailyEntry({today, addedItems, totalForToday, userID})
      show=false
      "
        >Yes, Overwrite entry</v-btn>
        <v-btn color="error" flat @click.stop="show=false">No, Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

import dayjs from "dayjs";

export default {
  props: ["visible"],
  computed: {
    ...mapState("searchAndAdd", ["addedItems"]),
    ...mapState("firebase", ["userID"]),
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    },
    today() {
      return dayjs().format("YYYY-MM-DD");
    }
  },
  methods: {
    ...mapActions("other", ["overwriteDailyEntry"])
  }
};
</script>

<style scoped>
.v-card__actions {
  justify-content: space-around;
  padding: 15px;
}
</style>