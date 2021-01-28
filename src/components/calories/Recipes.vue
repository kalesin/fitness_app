<template>
  <v-dialog v-model="show" width="90%">
    <v-card height="100vh" class="pa-3">
      <div class="d-flex" style="height: 30vh">
        <Search class="flex-grow-1" ></Search>
        <RecipeBox :nutrientArray="totalRecipe"></RecipeBox>
      </div>
      <div class="d-flex" style="height: 50vh">
        <RecipesEdit class="pa-3 flex-grow-1"></RecipesEdit>
      </div>
      <v-card-actions class="justify-end">
        <v-btn icon color="error" @click.stop="show=false">
          <v-icon x-large>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RecipeBox from "./RecipeBox";
import RecipesEdit from "./RecipesEdit";

import Search from "./Search";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  components: {
    RecipeBox,
    RecipesEdit,
    Search
  },
  computed: {
    ...mapState("firebase", ["userID"]),
    ...mapGetters("searchAndAdd4", { totalRecipe: "totalForToday" }),
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapState("other", ["deleteIndex"]),
    show: {
      get() {
        return this.index != -1;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    }
  },
  methods: {
    ...mapActions("other", ["removeRecipe"]),
    ...mapActions("searchAndAdd4", { searchRecipe: "searchFood" })
  }
};
</script>

<style scoped>
.v-card__actions {
  justify-content: space-around;
  padding: 15px;
}
</style>