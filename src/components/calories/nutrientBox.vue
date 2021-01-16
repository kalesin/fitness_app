<template>
  <v-card outlined class="transparent pa-0 ma-0">
    <v-card v-if="type === 'box'" class="rounded-t-xl" flat tile outlined>
      <v-card-text class="text-center text-h5 pa-2">{{nutrientArray[0]}} kcal</v-card-text>
    </v-card>

    <v-card v-if="type === 'daily'" class="rounded-t-xl" outlined tile>
      <v-row style="width: 100%" class="mx-0">
        <v-col cols="2">
          <v-progress-circular
            :size="100"
            :width="20"
            :rotate="90"
            :value="dailyProgress"
            color="green"
          >{{ Math.round(dailyProgress) }} %</v-progress-circular>
        </v-col>
        <v-col cols="6" class="py-6 ml-12">
          <v-card-text class="text-center text-h6 pa-0 font-weight-regular">Today's total:</v-card-text>
          <v-card-text class="text-center text-h4 pa-0">{{nutrientArray[0]}} kcal</v-card-text>
        </v-col>
        <v-col cols="1" class="py-10 pl-0">
          <v-btn
            icon
            large
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
            large
            @click.stop="showDialogue=true"
            :disabled="isDisabled"
          >
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <app-entry-dialogue :visible="showDialogue" @close="showDialogue=false"></app-entry-dialogue>
        </v-col>
      </v-row>
    </v-card>

    <v-card v-if="type=='recipe'" class="rounded-t-xl" outlined tile>
      <!-- <v-row style="width: 100%" class="mx-0 px-2">
        <v-col cols="8" class="pa-0 my-0">
          <v-card-text class="text-h6 font-weight-medium pa-3 pb-0">Recipe name:</v-card-text>
        </v-col>
        <v-col cols="4" class="pa-0  my-0">
          <v-card-text  class="text-h6 font-weight-medium pa-3 pb-0">Portions:</v-card-text>
        </v-col>
      </v-row>-->
      <v-row style="width: 100%" class="mx-0 px-2 pt-4">
        <v-col cols="8" class="py-0">
          <v-text-field
            dense
            outlined
            type="text"
            label="Recipe name"
            v-model="recipesName"
            value="name"
            @keyup.enter="
              onChanged({item, index, userID, moduleIndex, quantity})"
          ></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <v-text-field
            dense
            outlined
            type="number"
            step="1"
            v-model="recipesPortions"
            label="Portions"
            value="portions"
            @keyup.enter="
              onChanged({item, index, userID, moduleIndex, quantity})"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row style="width: 100%" class="mx-0 mb-3">
        <v-col cols="2">
          <v-progress-circular
            :size="100"
            :width="20"
            :rotate="90"
            :value="recipeProgress"
            color="green"
          >{{ Math.round(recipeProgress) }} %</v-progress-circular>
        </v-col>
        <v-col cols="6" class="py-6 ml-12">
          <v-card-text class="text-center text-h6 pa-0 font-weight-regular">Recipe total:</v-card-text>
          <v-card-text class="text-center text-h4 pa-0">{{nutrientArray[0]}} kcal</v-card-text>
        </v-col>
        <v-col cols="1" class="py-10 pl-0">
          <v-btn
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
        </v-col>
      </v-row>
    </v-card>

    <v-row style="width: 100%" class="ma-0">
      <v-col class="pa-0">
        <v-card flat tile outlined class="rounded-bl-xl">
          <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-2">Protein:</v-card-text>
          <v-card-text class="text-center pa-2">{{nutrientArray[1]}} g</v-card-text>
        </v-card>
      </v-col>
      <v-col class="pa-0">
        <v-card flat tile outlined>
          <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-2">Carbs:</v-card-text>
          <v-card-text class="text-center pa-2">{{nutrientArray[2]}} g</v-card-text>
        </v-card>
      </v-col>
      <v-col class="pa-0">
        <v-card flat tile outlined>
          <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-2">Fats:</v-card-text>
          <v-card-text class="text-center pa-2">{{nutrientArray[3]}} g</v-card-text>
        </v-card>
      </v-col>
      <v-col class="pa-0">
        <v-card flat tile outlined class="rounded-br-xl">
          <v-card-text class="text-center text-subtitle-1 font-weight-bold pa-2">Fiber:</v-card-text>
          <v-card-text class="text-center pa-2">{{nutrientArray[4]}} g</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>

  <!-- <div :class="{small: size === 'small', large: size ==='large'}">

    <div v-if="size === 'large' && total==='daily'" class="progressBar">
      <div class="progressBarBackground" :style="daily"></div>
      <div class="progressBarText">{{nutrientArray[0]}} kcal</div>
      <hr />
    </div>

    <div v-if="size === 'large' && total==='recipe'" class="progressBar">
      <div class="progressBarBackground" :style="recipe"></div>
      <div class="progressBarText">{{nutrientArray[0]}} kcal</div>
      <hr />
    </div>

    <div v-if="size === 'large' && total==='addedItems'" class="progressBar">
      <div class="progressBarBackground" :style="addedItems"></div>
      <div class="progressBarText">{{nutrientArray[0]}} kcal</div>
      <hr />
    </div>

    <div v-if="size === 'large' && total==='editRecipe'" class="progressBar">
      <div class="progressBarBackground" :style="editRecipe"></div>
      <div class="progressBarText">{{nutrientArray[0]}} kcal</div>
      <hr />
    </div>

    <div v-if="type ==='normal'" class="nutrientBox">
      <div v-if="size === 'small'" class="nutrientSubBox">
        <div class="nutrientType"></div>
        {{nutrientArray[0]}} kcal
      </div>
      <div class="nutrientSubBox">
        <div class="nutrientType">Protein:</div>
        {{nutrientArray[1]}} g
      </div>
      <div class="nutrientSubBox">
        <div class="nutrientType">Carbs:</div>
        {{nutrientArray[2]}} g
      </div>
      <div class="nutrientSubBox">
        <div class="nutrientType">Fats:</div>
        {{nutrientArray[3]}} g
      </div>
      <div class="nutrientSubBox">
        <div class="nutrientType">Fiber:</div>
        {{nutrientArray[4]}} g
      </div>
    </div>
<div v-if="type ==='small'" class="nutrientBox">
      <div v-if="size === 'small'" class="nutrientSubBox2">
        <div class="nutrientType"></div>
        {{nutrientArray[0]}} kcal
      </div>
      <div class="nutrientSubBox2">
        <div class="nutrientType">Protein:</div>
        {{nutrientArray[1]}} g
      </div>
      <div class="nutrientSubBox2">
        <div class="nutrientType">Carbs:</div>
        {{nutrientArray[2]}} g
      </div>
      <div class="nutrientSubBox2">
        <div class="nutrientType">Fats:</div>
        {{nutrientArray[3]}} g
      </div>
      <div class="nutrientSubBox2">
        <div class="nutrientType">Fiber:</div>
        {{nutrientArray[4]}} g
      </div>
  </div>-->
</template>

<script>
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";

import EntryDialogue from "./EntryDialogue";

export default {
  mounted() {
    /* 
if(this.editIndex !== -1) {
this.recipesName = this.recipes[this.editIndex].NAME
    this.recipesPortions = this.recipes[this.editIndex].PORTIONS
}
     */

    let index = this.dailyEntries.findIndex(element => element.date===this.today
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
    }
  },
  computed: {
    portions() {
      return this.recipes[this.editIndex].PORTIONS;
    },
    name() {
      return this.recipes[this.editIndex].NAME;
    },
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
    ...mapState("searchAndAdd", [
      "addedItems",
      "doneAddingItem",
      "idx",
      "responseCount",
      "focus"
    ]),
    ...mapState("searchAndAdd4", { addedRecipe: "addedItems" }),
    ...mapState("other", [
      "maintenanceCalories",
      "dailyEntries",
      "entryTodayExists",
      "entryTodayIndex",
      "editIndex"
    ]),
    ...mapState("other", ["recipes"]),
    ...mapState("firebase", ["userID"]),
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapGetters("searchAndAdd2", { ingredientsTotal: "totalForToday" }),
    ...mapGetters("searchAndAdd3", { addedItemsTotal: "totalForToday" }),
    ...mapGetters("searchAndAdd4", { totalRecipe: "totalForToday" }),
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
      "setMaintenanceCalories",
      "addDailyEntry",
      "setEntryTodayIndex",
      "saveIngredients",
      "addToRecipes",
      "setEditIndex"
    ])
  }
};
</script>

<style scoped>
</style>
