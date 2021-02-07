<template>
  <v-card class="blue lighten-3 rounded-lg pa-0" tile flat>
    <div class="d-flex align-center mx-4">
      <v-card-text class="text-h4">My Recipes:</v-card-text>
      <v-btn
        v-if="editIndex!=-2"
        color="success"
        @click="
      setEditIndex(-2)
      startEdit(-2)"
      >
        <v-icon>mdi-plus-circle</v-icon>add new
      </v-btn>
      <v-btn class="align-center" v-else color="error" @click="
      setEditIndex(-1)">
        <v-icon>mdi-close-thick</v-icon>scrap
      </v-btn>
    </div>
    <div class="overflow-y-auto d-flex flex-column addedFoods">
      <div v-for="(item, index) in recipes" :key="index" class="itemCard pa-2 pt-0">
        <v-card
          outlined
          class="lime accent-1 rounded-lg"
          :class="{'red lighten-4': editIndex == index}"
        >
          <div class="d-flex">
            <v-card-text
              style="text-transform: capitalize; width: 65%;"
              class="text-h5 pa-2"
            >{{item.NAME}} (per portion)</v-card-text>
            <div class="d-flex align-center justify-space-between" style="width: 35%">
              <v-btn
                icon
                large
                color="green"
                @click="
      addPortionOfRecipe(index);
      addItemValue(portionItem)
            updateAddedItems()"
              >
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
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
            onRemoved({index, userID, moduleIndex})
            setDeleted(true)"
              >
                <v-icon class="mr-2" @click.stop="shownIndex=index">mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
          <NutrientBox :nutrientArray="item.PORTION_NUTRIENTS" class="ma-2 mt-0"></NutrientBox>
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
      "setDeleteIndex"
    ]),
    ...mapActions("searchAndAdd", ["addItemValue", "setAddedItems"]),
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
        todaysItems: this.$store.state.searchAndAdd.addedItems
      };
      this.$http.patch("data/" + `${this.userID}` + ".json", data);
    },
    log(value) {
      console.log(value);
    }
  }
};
</script>

<style scoped>
.addedFoods {
  height: calc(100% - 72px);
}
</style>