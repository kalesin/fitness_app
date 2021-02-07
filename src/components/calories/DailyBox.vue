<template>
  <v-card outlined class="pa-0 rounded-xl">
    <div class="d-flex my-auto">
      <v-progress-circular
        class="ma-auto"
        :size="100"
        :width="20"
        :rotate="90"
        :value="dailyProgress"
        color="green"
      >{{ Math.round(dailyProgress) }} %</v-progress-circular>

      <div class="ma-auto my-auto totalText" style="width: 250px">
        <div class="ma-0">
          <v-card-text class="text-center text-h4 pa-0 pt-4 font-weight-bold">Today's total:</v-card-text>
          <v-card-text class="text-center text-h4 pa-0 pt-2">{{nutrientArray[0]}} kcal</v-card-text>
        </div>

        <div class="d-flex justify-space-between mb-5">
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
      </div>

      <div class="d-flex flex-column ma-auto align-space-between justify-space-around">
        <v-btn
          icon
          x-large
          v-if="entryTodayIndex==-1"
          color="success"
          @click="
            addDailyEntry({today, addedItems, totalForToday, userID})"
          :disabled="isDisabled"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn
          icon
          v-else
          color="success"
          x-large
          @click.stop="showDialogue=true"
          :disabled="isDisabled"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <app-entry-dialogue :visible="showDialogue" @close="showDialogue=false"></app-entry-dialogue>
      </div>
    </div>
  </v-card>
</template>

<script>
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";

import EntryDialogue from "./EntryDialogue";

export default {
  mounted() {
    let index = this.dailyEntries.findIndex(
      element => element.date === this.today
    );
    if (index == -1) {
      this.setEntryTodayIndex(-1);
    } else {
      this.setEntryTodayIndex(index);
    }
  },
  components: {
    appEntryDialogue: EntryDialogue
  },
  props: ["nutrientArray", "size", "type", "total"],
  data() {
    return {
      activeIndex: -1,
      showDialogue: false,
      moduleIndex: 1,
      rules: [v => v.length <= 30 || "Max 30 characters"]
    };
  },
  watch: {
    addedItems: {
      handler() {
        for (let i = 0; i < this.dailyEntries.length; i++) {
          if (this.dailyEntries[i].date === this.today) {
            this.setEntryTodayIndex(i);
          }
        }
      }
    }
  },
  computed: {
    today() {
      return dayjs().format("YYYY-MM-DD");
    },
    isDisabled() {
      let disabled = false;
      if (this.addedItems.length == 0) {
        disabled = true;
      }
      return disabled;
    },
    ...mapState("searchAndAdd", ["addedItems"]),
    ...mapState("other", [
      "maintenanceCalories",
      "dailyEntries",
      "entryTodayIndex",
      "editIndex"
    ]),
    ...mapState("firebase", ["userID"]),
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    dailyProgress: {
      get() {
        return (this.totalForToday[0] / this.maintenanceCalories) * 100;
      },
      set(value) {}
    }
  },
  methods: {
    ...mapActions("searchAndAdd", ["onChanged", "onRemoved", "setFocus"]),
    ...mapActions("other", [
      "saveIngredients",
      "addDailyEntry",
      "setEntryTodayIndex",
      "addToRecipes",
      "setEditIndex"
    ])
  }
};
</script>

<style scoped>
</style>
