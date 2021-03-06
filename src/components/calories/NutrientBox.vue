<template>
  <v-card flat outlined class="pa-0 rounded-xl d-flex flex-column">
    <v-card-text class="text-center text-h4 pa-2" style="font-size: 2rem !important">{{nutrientArray[0]}} kcal</v-card-text>
    <div class="d-flex justify-space-between mx-4">
          <div>
            <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-1">Protein:</v-card-text>
            <v-card-text class="text-center pa-1 totalTextSize">{{nutrientArray[1]}} g</v-card-text>
          </div>
          <div>
            <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-1">Carbs:</v-card-text>
            <v-card-text class="text-center pa-1 totalTextSize">{{nutrientArray[2]}} g</v-card-text>
          </div>
          <div>
            <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-1">Fats:</v-card-text>
            <v-card-text class="text-center pa-1 totalTextSize">{{nutrientArray[3]}} g</v-card-text>
          </div>
          <div>
            <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-1">Fiber:</v-card-text>
            <v-card-text class="text-center pa-1 totalTextSize">{{nutrientArray[4]}} g</v-card-text>
          </div>
        </div>
  </v-card>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  props: ["nutrientArray"],
  data() {
    return {};
  },
  computed: {
    ...mapState("searchAndAdd", ["addedItems"]),
    ...mapState("other", [
      "maintenanceCalories",
      "dailyEntries",
      "entryTodayIndex",
      "editIndex"
    ]),
    ...mapState("other", ["recipes"]),
    ...mapState("firebase", ["userID"]),
    ...mapGetters("searchAndAdd", ["totalForToday"])
  },
  methods: {
    ...mapActions("other", [
      "addDailyEntry",
      "addToRecipes",
    ])
  }
};
</script>

<style scoped>
</style>
