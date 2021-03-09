<template>
  <v-dialog v-model="show" width="80%">
    <v-card class="pa-3 d-flex flex-column" style="height: 90vh">
      <RecipeBox :nutrientArray="totalRecipe" style="height: 240px">
        <v-btn
          class="totalButtons mb-2"
          width="52"
          height="52"
          icon
          color="error"
          @click.stop="show=false"
        >
          <v-icon x-large>mdi-close-circle</v-icon>
        </v-btn>
      </RecipeBox>
      <Search class="mx-auto mt-5" style="height: 64px; width: 80%" :moduleIndex="moduleIndex"></Search>
      <RecipesEdit class="recipesEdit" :moduleIndex="moduleIndex"></RecipesEdit>
    </v-card>

    <v-snackbar absolute top rounded="pill" shaped v-model="snackbar">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar=false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import RecipeBox from "./RecipeBox";
import RecipesEdit from "./RecipesEdit";

import Search from "./Search";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  mounted() {
    if (!this.addedRecipe) {
      /* alert("Can't submit a recipe with no items, add some items!") */
      this.snackbar = true;
    }
  },
  data() {
    return {
      snackbar: false,
      text: `Can't submit a recipe with no items, add some items!`,
      moduleIndex: 2
    };
  },
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
    ...mapState("searchAndAdd2", { addedRecipe: "addedItems" }),
    ...mapGetters("searchAndAdd2", { totalRecipe: "totalForToday" }),
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
  methods: {}
};
</script>

<style scoped>
.v-card__actions {
  justify-content: space-around;
  padding: 15px;
}
.recipesEdit {
  height: calc(90vh - 240px - 64px - 3 * 12px);
}

@media only screen and (max-width: 1000px) {
  .totalButtons {
    width: 40px !important;
  }
}
</style>