<template>
  <v-card style="height: 225px" flat outlined>
    <v-row>
      <v-col cols="6">
        <v-card-text class="text-h5 pl-4 font-weight-medium pt-2 pa-0">Today's total:</v-card-text>
      </v-col>
      <v-col  cols="6" class="mt-1">
        <v-btn
          v-if="entryTodayIndex==-1"
          color="success"
          @click="
            addDailyEntry({today, addedItems, totalForToday, userID})"
          :disabled="isDisabled"
        >Save today</v-btn>
        <v-btn
          v-else
          color="success"
          large
          @click.stop="showDialogue=true"
          :disabled="isDisabled"
        >Save today</v-btn>
        <app-entry-dialogue :visible="showDialogue" @close="showDialogue=false"></app-entry-dialogue>
      </v-col>
    </v-row>

    <!-- <v-text-field
      type="number"
      class="form-control"
      placeholder="Enter maintenance calories"
      v-model="savedCalories"
    ></v-text-field>
    <v-btn
      color="success"
      @click="
            setMaintenanceCalories({savedCalories, userID})"
      :disabled="parseFloat(savedCalories)<=0"
    >Set</v-btn>-->

    <app-nutrient-box :nutrientArray="totalForToday" size="large" type="normal" total="daily" class="pa-3"></app-nutrient-box>
  </v-card>
</template>

<script>
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";

import EntryDialogue from "./EntryDialogue";
import nutrientBox from "./nutrientBox.vue";

export default {
  mounted() {
    let index = this.dailyEntries.findIndex(element => {
      element.date === this.today;
    });
    if (index != -1) {
      this.setEntryTodayIndex(index);
    } else {
      this.setEntryTodayIndex(-1);
    }
  },
  components: {
    appNutrientBox: nutrientBox,
    appEntryDialogue: EntryDialogue
  },
  data() {
    return {
      activeIndex: -1,
      showDialogue: false,
      moduleIndex: 1
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
    },
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapState("searchAndAdd", [
      "addedItems",
      "doneAddingItem",
      "idx",
      "responseCount",
      "focus"
    ]),
    ...mapState("other", [
      "maintenanceCalories",
      "dailyEntries",
      "entryTodayExists",
      "entryTodayIndex"
    ]),
    ...mapState("firebase", [
      "password",
      "email",
      "loggedIn",
      "userData",
      "userID"
    ]),
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
    quantity: {
      get() {
        return this.$store.state.searchAndAdd.quantity;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQuantity", value);
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd", ["onChanged", "onRemoved", "setFocus"]),
    ...mapActions("other", [
      "setMaintenanceCalories",
      "addDailyEntry",
      "setEntryTodayIndex"
    ]),
  }
};
</script>