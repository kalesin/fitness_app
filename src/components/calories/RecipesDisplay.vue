<template>
  <v-card class="rounded-b-lg rounded-t-xl pa-0" tile flat outlined style="height: 80%">
    <v-row class="mx-0" style="width: 100%">
      <v-col cols="7" class="pa-0">
        <v-card-text class="text-h4">My Recipes:</v-card-text>
      </v-col>
      <v-col cols="4" class="pa-0 pt-4 pl-2">
        <v-btn v-if="editIndex!==-2" color="success" @click="
      setEditIndex(-2)">
          <v-icon>mdi-plus-circle</v-icon>add new
        </v-btn>
        <v-btn v-else color="error" @click="
      setEditIndex(-1)">
          <v-icon>mdi-close-thick</v-icon>scrap
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="rounded-b-lg" tile flat outlined style="height: 93%">
      <v-row class="mx-0 overflow-y-auto" style="width: 100%; height: 100%">
        <v-col v-for="(item, index) in recipes" :key="index" cols="12" class="pa-2 pb-0">
          <v-card flat outlined style="width: 100%" :class="{editing: editIndex == index}">
            <v-row style="width: 100%;" class="mx-0">
              <v-col cols="7" class="ma-0 pa-0">
                <v-card-text class="text-h5 pa-0 pl-4 pt-6" v-if="type==='add'">{{item.NAME}}</v-card-text>
                <v-card-text class="text-h5 pa-1 pl-4" v-if="type==='add'">(per portion)</v-card-text>

                <v-card-text class="text-h5 pb-0" v-if="type==='edit'">{{item.NAME}}</v-card-text>
              </v-col>
              <v-col cols="1" class="my-4 px-0">
                <v-btn
                  icon
                  x-large
                  color="green"
                  @click="
      addPortionOfRecipe(index);
      addItemValue(itemToAdd);
      setDoneAddingItem(true);
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
        setAddedItems(recipes[index].INGREDIENTS)
              startEdit(index)"
                >
                  <v-icon v-if="activeIndex!==index">mdi-pencil-outline</v-icon>
                  <v-icon v-else>mdi-pencil-off-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="1" class="my-5 pl-8">
                <v-btn large icon color="red" @click.stop="showDialogue=true">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <app-delete-dialogue :visible="showDialogue" @close="showDialogue=false"></app-delete-dialogue>
              </v-col>
            </v-row>
            <app-nutrient-box class="px-3 pb-3" :nutrientArray="item.PORTION_NUTRIENTS" type="box"></app-nutrient-box>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-card>

  <!-- <div>
    <div class="panel-main-heading">
      <h3 class="panel-main-title">My Recipes:</h3>
    </div>
    <div :class="{edit: type === 'edit', addList: type ==='add'}">
      <div class="panel panel-success" v-for="(item, index) in recipes" :key="index">
        <div class="panel-heading">
          <h3
            v-if="type==='add'"
            class="panel-title"
            style="text-transform: capitalize;"
          >{{item.NAME}} (per portion)</h3>
          <h3
            v-if="type==='edit'"
            class="panel-title"
            style="text-transform: capitalize;"
          >{{item.NAME}}</h3>
        </div>
        <div v-if="type==='add'" class="panel-body">
          <div class="nutribox">
            <app-nutrient-box
              :nutrientArray="item.PORTION_NUTRIENTS"
              size="small"
              type="small"
              style="flex-grow: 1"
            ></app-nutrient-box>
            <button
              @click="
      addPortionOfRecipe(index);
      addItemValue(itemToAdd);
      setDoneAddingItem(true);
            updateAddedItems()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                enable-background="new 0 0 50 50"
              >
                <path
                  d="M9.6 40.4l2.5-9.9L27 15.6l7.4 7.4-14.9 14.9-9.9 2.5zm4.3-8.9l-1.5 6.1 6.1-1.5L31.6 23 27 18.4 13.9 31.5z"
                />
                <path d="M17.8 37.3c-.6-2.5-2.6-4.5-5.1-5.1l.5-1.9c3.2.8 5.7 3.3 6.5 6.5l-1.9.5z" />
                <path d="M29.298 19.287l1.414 1.414-13.01 13.02-1.414-1.412z" />
                <path d="M11 39l2.9-.7c-.3-1.1-1.1-1.9-2.2-2.2L11 39z" />
                <path
                  d="M35 22.4L27.6 15l3-3 .5.1c3.6.5 6.4 3.3 6.9 6.9l.1.5-3.1 2.9zM30.4 15l4.6 4.6.9-.9c-.5-2.3-2.3-4.1-4.6-4.6l-.9.9z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="type==='edit'" class="panel-body">
          <div class="nutribox2">
            <p style="margin: 0 10px; flex-grow: 1">Recipe total:</p>

            <app-nutrient-box
              :nutrientArray="item.NUTRIENTS"
              size="small"
              type="small"
              style="flex-grow: 1;"
            ></app-nutrient-box>
            <p style="margin: 0 10px; flex-grow: 1">{{item.PORTIONS}} Portions</p>
            <button
              v-if="!(editIndex===index)"
              class="btn btn-success edit-btn"
              @click="
          setEditIndex(index)
        setAddedItems(recipes[editIndex].INGREDIENTS)
          "
            >Edit</button>
            <button
              v-if="editIndex===index"
              class="btn btn-danger edit-btn"
              @click="
          setEditIndex(-1)
          "
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>-->
</template>

<style scoped>
.editing {
  background-color: rgba(0, 219, 0, 0.719);
}
</style>

<script>
import nutrientBox from "./nutrientBox.vue";
import { mapState, mapActions } from "vuex";
import DeleteDialogue from "./DeleteDialogue";

export default {
  props: ["type"],
  components: {
    appNutrientBox: nutrientBox,
    appDeleteDialogue: DeleteDialogue
  },
  data() {
    return {
      showDialogue: false,
      activeIndex: -1
    };
  },
  computed: {
    ...mapState("other", [
      "recipes",
      "recipeQuantity",
      "itemToAdd",
      "editIndex"
    ]),
    ...mapState("firebase", [
      "password",
      "email",
      "loggedIn",
      "userData",
      "userID"
    ]),
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
      "removeRecipe",
      "setRecipeQuantity",
      "createItemToAddObject",
      "setEditIndex",
      "createIngredientsTemp"
    ]),
    ...mapActions("searchAndAdd4", [
      "addItem",
      "addItemValue",
      "setDoneAddingItem",
      "setAddedItems"
    ]),
    ...mapActions("searchAndAdd4", ["setAddedItems"]),
    startEdit(index) {
      if (this.activeIndex == index) {
        this.activeIndex = -1;

        this.setEditIndex(-1);
        this.setAddedItems([]);
      } else {
        this.activeIndex = index;

        this.setEditIndex(index);
        this.setAddedItems(this.recipes[index].INGREDIENTS);
      }
    },
    updateAddedItems() {
      const data = {
        todaysItems: this.$store.state.searchAndAdd.addedItems
      };
      this.$http.patch("data/" + `${this.userID}` + ".json", data);
    }
  }
};
</script>