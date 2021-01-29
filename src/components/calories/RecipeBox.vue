<template>
  <v-card outlined class="pa-0 mb-2 rounded-xl" style="border: solid #cccccc 1px; overflow: hidden; min-height: 20vh !important">
    <div class="d-flex">
      <v-text-field
        class="ma-4 mb-0"
        counter="30"
        :rules="rules"
        maxlength="30"
        dense
        outlined
        type="text"
        label="Recipe name"
        v-model="recipesName"
      ></v-text-field>
      <v-text-field
      :rules="rules2"
        class="ma-4 mb-0"
        dense
        outlined
        type="number"
        step="1"
        v-model="recipesPortions"
        label="Portions"
      ></v-text-field>
    </div>

    <div class="d-flex">
      <v-progress-circular
        class="mx-4 my-auto"
        :size="100"
        :width="20"
        :rotate="90"
        :value="recipeProgress"
        color="green"
      >{{ Math.round(recipeProgress) }} %</v-progress-circular>
      <div class="d-flex align-center mx-auto">
        <v-btn
          v-if="editIndex == -2"
          icon
          large
          color="success"
          @click="
            addToRecipes({totalForToday: totalRecipe, addedItems: addedRecipe, recipesName, recipesPortions, userID})
            setEditIndex(-1)"
          :disabled="parseFloat(recipesPortions)<=0 || recipesName===''"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn
          v-else
          icon
          large
          color="success"
          @click="
            saveIngredients({editIndex, totalRecipe, addedRecipe, recipesName, recipesPortions, userID})
            setEditIndex(-1)"
          :disabled="parseFloat(recipesPortions)<=0 || recipesName===''"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </div>

      <div class="flex-shrink-1 mr-2" style="width: 50%">
        <div class="mx-auto mb-2">
          <v-card-text class="text-center text-h6 pa-0 font-weight-regular">Recipe total:</v-card-text>
          <v-card-text class="text-center text-h4 pa-0">{{nutrientArray[0]}} kcal</v-card-text>
        </div>

        <div class="d-flex justify-space-around">
          <div>
            <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-1">Protein:</v-card-text>
            <v-card-text class="text-center pa-1">{{nutrientArray[1]}} g</v-card-text>
          </div>
          <div>
            <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-1">Carbs:</v-card-text>
            <v-card-text class="text-center pa-1">{{nutrientArray[2]}} g</v-card-text>
          </div>
          <div>
            <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-1">Fats:</v-card-text>
            <v-card-text class="text-center pa-1">{{nutrientArray[3]}} g</v-card-text>
          </div>
          <div>
            <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-1">Fiber:</v-card-text>
            <v-card-text class="text-center pa-1">{{nutrientArray[4]}} g</v-card-text>
          </div>
        </div>
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
  props: ["nutrientArray", "size", "type", "total"],
  data() {
    return {
      activeIndex: -1,
      showDialogue: false,
      moduleIndex: 1,
      rules: [v => v.length <= 30 || "Max 30 characters"],
      rules2: [v => v>=1 || "Portions can't be - or 0"]
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
    editIndex: {
      handler() {
        if (this.editIndex != -1 && this.editIndex != -2) {
          this.recipesName = this.recipes[this.editIndex].NAME;
          this.recipesPortions = this.recipes[this.editIndex].PORTIONS;
        } else if (this.editIndex != -1 && this.editIndex == -2) {
          this.recipesName = "New recipe";
          this.recipesPortions = 0;
        }
      }
    }
  },
  computed: {
    recipesPortions: {
      get() {
        return this.$store.state.other.recipesPortions;
      },
      set(value) {
        this.$store.dispatch("other/setPortions", value);
      }
    },
    recipesName: {
      get() {
        return this.$store.state.other.recipesName;
      },
      set(value) {
        this.$store.dispatch("other/nameRecipe", value);
      }
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
    ...mapState("searchAndAdd", ["addedItems"]),
    ...mapState("searchAndAdd2", { addedRecipe: "addedItems" }),
    ...mapState("other", [
      "maintenanceCalories",
      "dailyEntries",
      "entryTodayIndex",
      "editIndex"
    ]),
    ...mapState("other", ["recipes"]),
    ...mapState("firebase", ["userID"]),
    ...mapGetters("searchAndAdd", ["totalForToday"]),/* 
    ...mapGetters("searchAndAdd2", { ingredientsTotal: "totalForToday" }), */
    ...mapGetters("searchAndAdd3", { addedItemsTotal: "totalForToday" }),
    ...mapGetters("searchAndAdd2", { totalRecipe: "totalForToday" }),
    dailyProgress: {
      get() {
        return (this.totalForToday[0] / this.maintenanceCalories) * 100;
      },
      set(value) {}
    },
    recipeProgress: {
      get() {
        return (this.totalRecipe[0] / this.maintenanceCalories) * 100;
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
