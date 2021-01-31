<template>
  <v-container fluid class="grey lighten-5 ma-0 pa-3 d-flex flex-column">
    <div class="d-flex mb-3" style="height: 180px;">
      <Search class="mr-3" style="height: 180px; width: 50vw"></Search>
      <DailyBox style="height: 180px; width: 50vw" :nutrientArray="totalForToday"></DailyBox>
    </div>
    <div class="d-flex">
      <AddedFoods class="flex-grow-1 addedFoods" style="width: 75vw;"></AddedFoods>

      <RecipesDisplay class="ml-3 addedFoods" style="width: 25vw" @close="activeIndex=-1"></RecipesDisplay>
    </div>

    <Recipes v-if="editIndex != -1" @close="editIndex=-1" :index="editIndex"></Recipes>
  </v-container>
</template>

<style scoped>
</style>

<script>
import AddedFoods from "./AddedFoods";
import RecipesDisplay from "./RecipesDisplay";
import DailyBox from "./DailyBox";
import Search from "./Search";

import Recipes from "./Recipes";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {
    AddedFoods,
    RecipesDisplay,
    DailyBox,
    Search,
    Recipes
  },
  watch: {
    editIndex: {
      handler() {
        if (this.editIndex != -1 && this.editIndex != -2) {
          console.log(this.recipes[0]);
          this.recipesName = this.recipes[this.editIndex].NAME;
          this.recipesPortions = this.recipes[this.editIndex].PORTIONS;
        } else if (this.editIndex != -1 && this.editIndex == -2) {
          this.recipesName = "New Recipe";
          this.recipesPortions = 1;
        }
      }
    }
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapState("other", ["recipes"]),
    quantity: {
      get() {
        return this.$store.state.searchAndAdd.quantity;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQuantity", value);
      }
    },
    editIndex: {
      get() {
        return this.$store.state.other.editIndex;
      },
      set(value) {
        this.$store.dispatch("other/setEditIndex", value);
      }
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
    }
  }
};
</script>

<style scoped>
.addedFoods {
  height: calc(100vh - 180px - 3 * 12px);
}
</style>