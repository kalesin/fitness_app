<template>
  <v-card outlined class="pt-5 rounded-xl">
    <div class="d-flex my-auto">
      <v-progress-circular
        class="ma-auto"
        :size="100"
        :width="20"
        :rotate="90"
        :value="entryProgress"
        color="green"
      >{{ Math.round(entryProgress) }} %</v-progress-circular>

      <div class="mx-auto my-auto totalText" style="width: 450px">
        <div>
          <v-card-text class="text-center text-h4 pa-0 pt-4 font-weight-bold">
            {{start}}
            <p style="display: inline-block; margin-left: -6px" v-html="sup"></p>
            {{end}} total:
          </v-card-text>

          <v-card-text class="text-center text-h4 pa-0 pt-2">{{nutrientArray[0]}} kcal</v-card-text>
        </div>

        <div class="d-flex justify-space-between mb-5 mx-auto" style="width: 250px">
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
        <slot></slot>
        <v-btn
          class="totalButtons"
          v-if="entryEditIndex == -2"
          icon
          x-large
          color="success"
          @click="
          submitNewEntry()
            "
          :disabled="addedItems.length == 0"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn
          class="totalButtons"
          v-else
          icon
          x-large
          color="success"
          @click="
            submitChangedEntry()"
          :disabled="addedItems.length == 0"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
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
    this.date = dayjs(this.editDate);
    this.start = this.date.format("D");
    this.end = this.date.format(" of MMMM YYYY");

    let index = this.dailyEntries.findIndex(
      element => element.date === this.today
    );
    if (index == -1) {
      this.setEntryTodayIndex(-1);
    } else {
      this.setEntryTodayIndex(index);
    }
  },
  components: {},
  props: ["nutrientArray", "size", "type", "total"],
  data() {
    return {
      activeIndex: -1,
      showDialogue: false,
      moduleIndex: 1,
      date: "",
      start: "",
      end: ""
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
    sup() {
      let mid = "";
      if (this.date.$D == 1) {
        mid = "st";
      } else if (this.date.$D == 2) {
        mid = "nd";
      } else if (this.date.$D == 3) {
        mid = "rd";
      } else {
        mid = "th";
      }
      return mid.sup();
    },
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
    ...mapState("searchAndAdd3", ["addedItems", "items"]),
    ...mapState("other", [
      "maintenanceCalories",
      "dailyEntries",
      "entryTodayIndex",
      "editIndex",
      "entryEditIndex",
      "editDate"
    ]),
    ...mapState("firebase", ["userID"]),
    ...mapGetters("searchAndAdd3", ["totalForToday"]),
    entryProgress: {
      get() {
        return (this.totalForToday[0] / this.maintenanceCalories) * 100;
      },
      set(value) {}
    }
  },
  methods: {
    ...mapActions("other", [
      "addDailyEntry",
      "setEntryEditIndex",
      "setEntryTodayIndex",
      "addToRecipes",
      "saveEntryChanges"
    ]),
    submitNewEntry() {
      this.addDailyEntry({
        today: this.editDate,
        addedItems: this.addedItems,
        items: this.items,
        totalForToday: this.totalForToday,
        userID: this.userID
      });
      this.setEntryEditIndex(-1);
    },
    submitChangedEntry() {
      this.saveEntryChanges({
        items: this.items,
        addedItems: this.addedItems,
        totalForToday: this.totalForToday,
        userID: this.userID
      });
    }
  }
};
</script>

<style scoped>
</style>
