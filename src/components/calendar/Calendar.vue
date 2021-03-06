<template>
  <div>
    <CalendarMonth v-if="entryEditIndex==-1"></CalendarMonth>
    <Entries v-else :dateClicked="dateClicked" :index="entryEditIndex" @close="setEntryEditIndex(-1)"></Entries>
  </div>
</template>

<script>
import Entries from "./Entries";
import CalendarMonth from "./CalendarMonth";

import { mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "Calendar",

  components: {
    CalendarMonth,
    Entries
  },

  data() {
    return {
      dateClicked: ""
    };
  },

  computed: {
    ...mapState("other", [
      "dailyEntries",
      "maintenanceCalories",
      "entryEditIndex",
      "editEntries",
      "daysUnix"
    ]),
    ...mapGetters("other", ["compareCalendar"])
  },

  methods: {
    ...mapActions("firebase", ["getData"]),
    ...mapActions("other", [
      "setEntryEditIndex",
    ]),
  }
};
</script>

<style scoped>
</style>
