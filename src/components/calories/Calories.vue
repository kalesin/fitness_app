<template>
  <v-container fluid class="grey lighten-5 ma-0 pa-3">
    <v-row style="width: 100%;" class="mx-0">
      <v-col cols="9" class="pr-0 pa-0">
        <Search></Search>
        <AddedFoods></AddedFoods>
      </v-col>
      <v-col cols="3" class="pa-0">
        <RecipesDisplay @close="activeIndex=-1"></RecipesDisplay>
        <NutrientBox :nutrientArray="totalForToday" type="daily"></NutrientBox>
      </v-col>
    </v-row>

    <Recipes v-if="editIndex != -1" @close="editIndex=-1" :index="editIndex"></Recipes>
  </v-container>
</template>

<style scoped>
</style>

<script>
import AddedFoods from "./AddedFoods";
import RecipesDisplay from "./RecipesDisplay";
import NutrientBox from "./NutrientBox";
import Search from "./Search";

import Recipes from "./Recipes";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {
    AddedFoods,
    RecipesDisplay,
    NutrientBox,
    Search,
    Recipes
  },
  computed: {

    ...mapGetters("searchAndAdd", ["totalForToday"]),
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
    }
  }
};
</script>