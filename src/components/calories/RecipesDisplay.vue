<template>
  <v-card class="blue lighten-3 rounded-lg pa-0" tile flat>
    <div class="d-flex align-center mx-4">
      <v-card-text class="text-h4 textSize">My Recipes:</v-card-text>
      <v-btn
        color="success"
        @click="
      setEditIndex(-2)
      startEdit(-2)"
      >
        <v-icon>mdi-plus-circle</v-icon>add new
      </v-btn>
    </div>
    <div class="overflow-y-auto d-flex flex-column addedFoods">
      <div v-for="(item, index) in recipes" :key="index" class="itemCard pa-2 pt-0">
        <v-card
          outlined
          class="red lighten-4 rounded-lg"
          :class="{'red lighten-4': editIndex == index}"
        >
          <div class="d-flex mt-2">
            <div style="width: 65%" class="d-flex justify-center align-center">
              <v-card-text
                style="text-transform: capitalize; text-align: center;"
                class="text-h5 pa-2"
              >{{item.NAME}}</v-card-text>
            </div>

            <div class="d-flex flex-column align-center justify-space-between" style="width: 35%">
              <div>
                <v-btn
                  icon
                  large
                  color="green"
                  @click="
      addPortionOfRecipe(index);
      addItemValue(portionItem)
            updateAddedItems()"
                >
                  <v-icon x-large>mdi-plus-circle</v-icon>
                </v-btn>
                <v-btn
                  class="justify-end"
                  color="yellow"
                  icon
                  large
                  @click="
          setFavorite({index, userID})"
                >
                  <v-icon v-if="recipes[index].IS_FAVORITE==true" class="mr-2">mdi-star</v-icon>
                  <v-icon v-else class="mr-2" color="black">mdi-star-outline</v-icon>
                </v-btn>
              </div>
              <div>
                <v-btn
                  class="justify-end"
                  large
                  icon
                  @click="setAddedRecipe(recipes[index].INGREDIENTS)
              startEdit(index)"
                >
                  <v-icon v-if="editIndex!==index" class="mr-2">mdi-pencil-outline</v-icon>
                  <v-icon v-else class="mr-2">mdi-pencil-off-outline</v-icon>
                </v-btn>
                <v-btn
                  class="justify-end"
                  icon
                  large
                  color="red"
                  @click="
            onRemoved({index, userID, moduleIndex})"
                >
                  <v-icon class="mr-2" @click.stop="shownIndex=index">mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
          <NutrientBox :nutrientArray="item.PORTION_NUTRIENTS" class="ma-2 totalTextSize"></NutrientBox>
        </v-card>
      </div>
    </div>

    <DeleteDialogue v-if="shownIndex >= 0" @close="shownIndex=-1" :index="shownIndex"></DeleteDialogue>
  </v-card>
</template>

<style scoped>
</style>

<script>
import NutrientBox from "./NutrientBox";
import { mapState, mapActions } from "vuex";
import DeleteDialogue from "./DeleteDialogue";

export default {
  components: {
    NutrientBox,
    DeleteDialogue
  },
  data() {
    return {
      shownIndex: -1
    };
  },
  computed: {
    ...mapState("other", ["recipes", "portionItem", "editIndex"]),
    ...mapState("searchAndAdd", ["itemsPropNames", "items", "itemsIndex"]),
    ...mapState("firebase", ["userID"]),
    quantity: {
      get() {
        return this.$store.state.other.recipeQuantity;
      },
      set(value) {
        this.$store.dispatch("other/setRecipeQuantity", value);
      }
    }
  },
  methods: {
    ...mapActions("other", [
      "addPortionOfRecipe",
      "setEditIndex",
      "setFavorite"
    ]),
    ...mapActions("searchAndAdd", ["addItemValue", "onRemoved"]),
    ...mapActions("searchAndAdd2", { setAddedRecipe: "setAddedItems" }),
    startEdit(index) {
      if (this.editIndex == index && this.editIndex != -2) {
        this.setEditIndex(-1);
      } else {
        this.setEditIndex(index);
        if (this.recipes[index]) {
          this.setAddedRecipe(this.recipes[index].INGREDIENTS);
        } else {
          this.setAddedRecipe([]);
        }
      }
    },
    updateAddedItems() {
      const data = {
        todaysAddedItems: this.addedItems
      };
      this.$http.patch("data/" + `${this.userID}` + ".json", data);

      const todaysItems = {
        breakfast: this.items[this.itemsPropNames[0]],
        lunch: this.items[this.itemsPropNames[1]],
        dinner: this.items[this.itemsPropNames[2]],
        snack: this.items[this.itemsPropNames[3]],
      };
      this.$http.patch(
        "data/" + `${this.userID}` + "/todaysItems.json",
        todaysItems
      );
    }
  }
};
</script>

<style scoped>
.addedFoods {
  height: calc(100% - 72px);
}

@media only screen and (max-width: 1300px) {
  .textSize {
    font-size: 26px !important;
  }
}
</style>