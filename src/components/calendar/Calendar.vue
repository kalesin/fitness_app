<template>
  <div>
    <CalendarMonth v-if="entryEditIndex===-1"></CalendarMonth>
    <EditEntries v-else :dateClicked="dateClicked"></EditEntries>
  </div>
</template>

<script>
import EditEntries from "./EditEntries";
import CalendarMonth from "./CalendarMonth";

import { mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "Calendar",

  components: {
    CalendarMonth,
    EditEntries
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
      "setDailyEntryTemp",
      "setEditEntries",
      "setDaysUnix"
    ]),
  }
};
</script>

<style scoped>
</style>
