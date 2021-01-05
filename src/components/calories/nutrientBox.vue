<template>
  <div :class="{small: size === 'small', large: size ==='large'}">
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

    <v-card v-if="type ==='normal'" outlined class="transparent">
      <v-card v-if="size === 'small'" class="rounded-t-xl" flat tile outlined>
        <v-card-text class="text-center text-h5 pa-2">{{nutrientArray[0]}} kcal</v-card-text>
      </v-card>

      <v-card v-if="size === 'large' && total==='daily'" class="rounded-t-xl" outlined tile>
        <!-- <v-progress-linear v-model="dailyProgress" color="success" height="50">
          <template v-slot:default="value">
            <strong class="text-center text-h5">{{ Math.round(value.value * maintenanceCalories/100, 2)}} kcal</strong>
          </template>
        </v-progress-linear>-->
        <v-row>
          <v-col cols="3" class="px-8">
            <v-progress-circular
              :size="100"
              :width="20"
              :rotate="90"
              :value="dailyProgress"
              color="green"
            >{{ Math.round(dailyProgress) }} %</v-progress-circular>
          </v-col>
          <v-col cols="8" class="mx-auto py-6">
            <v-card-text class="text-center text-h6 pa-0 font-weight-regular">Today's total:</v-card-text>
            <v-card-text class="text-center text-h4 pa-0">{{nutrientArray[0]}} kcal</v-card-text>
          </v-col>
        </v-row>

        <!-- <v-card
          class="rounded-t-xl green lighten-3"
          :style="daily"
          tile
          outlined
          style="position: absolute; height: 48px"
        >
          <v-card-text class="text-center text-h5 pa-2 mx-auto">{{nutrientArray[0]}} kcal</v-card-text>
        </v-card>-->
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

    <v-card v-if="type ==='small'">
      <v-card-text v-if="size === 'small'">{{nutrientArray[0]}} kcal</v-card-text>
      <v-card-text>Protein: {{nutrientArray[1]}} g</v-card-text>
      <v-card-text>Carbs: {{nutrientArray[2]}} g</v-card-text>
      <v-card-text>Fats: {{nutrientArray[3]}} g</v-card-text>
      <v-card-text>Fiber: {{nutrientArray[4]}} g</v-card-text>
    </v-card>
  </div>
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
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  props: ["nutrientArray", "size", "type", "total"],
  data() {
    return {};
  },
  computed: {
    ...mapState("other", ["maintenanceCalories"]),
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapGetters("searchAndAdd2", { ingredientsTotal: "totalForToday" }),
    ...mapGetters("searchAndAdd3", { addedItemsTotal: "totalForToday" }),
    ...mapGetters("searchAndAdd4", { editRecipeTotal: "totalForToday" }),
    dailyProgress: {
      get() {
        return (this.totalForToday[0] / this.maintenanceCalories) * 100;
      },
      set(value) {}
    },
    daily() {
      return {
        width: this.maintenanceCalories
          ? `${(this.totalForToday[0] / this.maintenanceCalories) * 100}%`
          : "0%"
      };
    },
    recipe() {
      console.log(this.ingredientsTotal);
      return {
        width: this.maintenanceCalories
          ? `${(this.ingredientsTotal[0] / this.maintenanceCalories) * 100}%`
          : "0%"
      };
    },
    addedItems() {
      return {
        width: this.maintenanceCalories
          ? `${(this.addedItemsTotal[0] / this.maintenanceCalories) * 100}%`
          : "0%"
      };
    },
    editRecipe() {
      return {
        width: this.maintenanceCalories
          ? `${(this.editRecipeTotal[0] / this.maintenanceCalories) * 100}%`
          : "0%"
      };
    }
  }
};
</script>

<style scoped>
/* .progressBarBackground {
  position: absolute;
  background-color: greenyellow;
  height: 30px;
  top: 1px;
  left: 1px;
  z-index: 0;
  max-width: 100%;
}
.progressBarText {
  text-align: center;
  border: 1px solid gray;
}
.progressBar {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  position: relative;
}
.nutrientSubBox2 {
  margin-right: -1px;
  border: 1px solid gray;
  text-align: center;
  padding: 8px;
  font-size: 12px;
}
.nutrientType {
  display: inline-block;
}
.nutrientBox {
  display: flex;
}
.nutrientSubBox {
  margin-right: 10px;
  width: 25%;
  border: 1px solid gray;
  text-align: center;
  padding: 10px;
}

.recipeBox {
  margin-right: -1px;
  border: 1px solid gray;
  text-align: center;
  padding: 10px;
}
.large {
}
.small {
} */
</style>
