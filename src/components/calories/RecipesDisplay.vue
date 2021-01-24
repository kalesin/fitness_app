<template>
  <v-card class="rounded-b-lg rounded-t-xl pa-0" tile flat outlined>
    <v-row class="mx-0" style="width: 100%">
      <v-col cols="7" class="pa-0">
        <v-card-text class="text-h4">My Recipes:</v-card-text>
      </v-col>
      <v-col cols="4" class="pa-0 pt-4 pl-2">
        <v-btn
          v-if="editIndex!=-2"
          color="success"
          @click="
      setEditIndex(-2)
      startEdit(-2)"
        >
          <v-icon>mdi-plus-circle</v-icon>add new
        </v-btn>
        <v-btn v-else color="error" @click="
      setEditIndex(-1)">
          <v-icon>mdi-close-thick</v-icon>scrap
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="rounded-b-lg" tile flat outlined>
      <v-row class="mx-0 overflow-y-auto" style="width: 100%">
        <v-col v-for="(item, index) in recipes" :key="index" cols="12" class="pa-2 pb-0">
          <v-card
            flat
            outlined
            style="width: 100%"
            :class="{'yellow lighten-4': editIndex == index}"
          >
            <v-row style="width: 100%;" class="mx-0">
              <v-col cols="7" class="ma-0 pa-0">
                <v-card-text class="text-h5 pa-0 pl-4 pt-6">{{item.NAME}}</v-card-text>
                <v-card-text class="text-h5 pa-1 pl-4">(per portion)</v-card-text>
              </v-col>
              <v-col cols="1" class="my-4 px-0">
                <v-btn
                  icon
                  x-large
                  color="green"
                  @click="
      addPortionOfRecipe(index);
      addItemValue(portionItem)
            updateAddedItems()"
                >
                  <v-icon>mdi-plus-circle</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="1" class="my-5 pl-6">
                <v-btn
                  large
                  icon
                  @click="
        setEditIndex(index)
        setAddedRecipe(recipes[index].INGREDIENTS)
              startEdit(index)"
                >
                  <v-icon v-if="activeIndex!==index">mdi-pencil-outline</v-icon>
                  <v-icon v-else>mdi-pencil-off-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="1" class="my-5 pl-8">
                <v-btn
                  large
                  icon
                  color="red"
                  @click.stop="showDialogue=true"
                  @click="setDeleteIndex(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <deletedialogue
                  :visible="showDialogue"
                  @close="showDialogue=false"
                  :index="index"
                ></deletedialogue>
              </v-col>
            </v-row>
            <nutrientbox class="px-3 pb-3" :nutrientArray="item.PORTION_NUTRIENTS" type="box"></nutrientbox>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<style scoped>
</style>

<script>
import nutrientBox from "./nutrientBox.vue";
import { mapState, mapActions } from "vuex";
import DeleteDialogue from "./DeleteDialogue";

export default {
  components: {
    nutrientbox: nutrientBox,
    deletedialogue: DeleteDialogue
  },
  data() {
    return {
      showDialogue: false,
      activeIndex: -1
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
    ...mapActions("searchAndAdd4", { setAddedRecipe: "setAddedItems" }),
    startEdit(index) {
      if (this.activeIndex == index && this.editIndex != -2) {
        this.activeIndex = -1;
        this.setEditIndex(-1);
        
      } else {
        this.activeIndex = index;
        if (this.recipes[index]) {
          this.setAddedRecipe(this.recipes[index].INGREDIENTS);
        }else {
          this.setAddedRecipe([]);
        }
        this.setEditIndex(index);
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