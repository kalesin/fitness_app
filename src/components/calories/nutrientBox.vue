<template>
  <div :class="{small: size === 'small', large: size ==='large'}">
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
    </div>
  </div>
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
    ...mapGetters("searchAndAdd2", {ingredientsTotal: "totalForToday"}),
    ...mapGetters("searchAndAdd3", {addedItemsTotal: "totalForToday"}),
    ...mapGetters("searchAndAdd4", {editRecipeTotal: "totalForToday"}),
    ...mapGetters("other", ["ingredientsTotal"]),
    daily() {
      return {
        width: this.maintenanceCalories
          ? `${(this.totalForToday[0] / this.maintenanceCalories) * 100}%`
          : "0%"
      };
    },
    recipe() {
      return {
        width: this.maintenanceCalories
          ? `${(this.ingredientsTotal[0] / this.maintenanceCalories) * 100}%`
          : "0%"
      };
    },
    addedItems(){
      return {
        width: this.maintenanceCalories
          ? `${(this.addedItemsTotal[0] / this.maintenanceCalories) * 100}%`
          : "0%"
      };
    },
    editRecipe(){
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
.progressBarBackground {
  position: absolute;
  background-color: greenyellow;
  height: 30px;
  top: 0;
  z-index: -1;
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
}
</style>
