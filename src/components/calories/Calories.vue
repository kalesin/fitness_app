<template>
  <v-container fluid class="ma-0 d-flex">
    <div class="d-flex flex-column middle">
      <DailyBox style="height: 190px;" :nutrientArray="totalForToday"></DailyBox>
      <Search class="mx-auto mt-5" style="height: 64px; width: 80%" :moduleIndex="moduleIndex"></Search>
      <AddedFoods class="addedFoods overflow-y-auto"></AddedFoods>
    </div>
    <div class="d-flex display" style="width: 390px">
      <RecipesDisplay class="ml-3" @close="activeIndex=-1"></RecipesDisplay>
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
  data() {
    return {
      moduleIndex: 1
    };
  },
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
.middle {
  width: calc(100% - 390px);
}
.addedFoods {
  height: calc(100vh - 190px - 60px - 4 * 12px);
}
.display {
  height: calc(100vh - 2 * 12px);
}
@media only screen and (max-width: 1300px) {
  .middle {
    width: calc(100% - 350px);
  }
  .display {
    height: calc(100vh - 2 * 12px);
    width: 350px !important;
  }
}
</style>