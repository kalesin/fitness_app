<template>
  <v-dialog v-model="show" width="90%">
    <v-card class="pa-3">
      <div class="d-flex mb-3" style="height: 240px;">
        <Search class="mr-3" style="height: 240px; width: 50vw"></Search>

        <RecipeBox :nutrientArray="totalRecipe" style="height: 240px; width: 50vw"><v-btn  class="totalButtons" width="52" height="52" icon color="error" @click.stop="show=false">
            <v-icon x-large>mdi-close-circle</v-icon>
          </v-btn></RecipeBox>
      </div>
      <div class="d-flex recipesEdit">
        <RecipesEdit class="flex-grow-1"></RecipesEdit>
        <v-card-actions class="justify-end"></v-card-actions>
      </div>
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
    ...mapGetters("searchAndAdd2", { totalRecipe: "totalForToday" }),
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
    ...mapActions("other", ["removeRecipe", "setEditIndex"]),
    ...mapActions("searchAndAdd2", { searchRecipe: "searchFood" })
  }
};
</script>

<style scoped>
.v-card__actions {
  justify-content: space-around;
  padding: 15px;
}
.recipesEdit {
  height: calc(90vh - 240px - 3*12px);
}

@media only screen and (max-width: 1000px) {
.totalButtons {
width: 40px !important;
}
}
</style>