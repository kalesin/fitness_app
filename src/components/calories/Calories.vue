<template>
  <v-container fluid class="grey lighten-5 ma-0 pa-3 pb-0" style="width: 100%">
    <v-row>

      <v-col cols="9" class="pa-0">
        <v-card outlined class="mx-3" style="height : 225px">
          <v-card-text class="text-h4 ma-2">Search for the food you want to add!</v-card-text>
          <v-row class="mx-2 mb-12">
            <v-col cols="9">
              <v-text-field
                style="width: 100%"
                dense
                clearable
                placeholder="Search foods"
                ref="search"
                solo
                v-model="query"
                @keyup.enter="
                allInOne();
                setDoneAddingItem(true); 
                "
              ></v-text-field>
            </v-col>
            <v-col cols="2" class="mx-auto">
              <v-btn
               style="width: 190px"
                color="success"
                @click="
              allInOne();
              setDoneAddingItem(true);
              "
              >
              <v-icon>mdi-magnify</v-icon>
              Search</v-btn>
            </v-col>
          </v-row>
        </v-card>
          <app-added-foods class="added-foods"></app-added-foods>
      </v-col>

      <v-col cols="3" class="pa-0 pr-3">
        <app-added-total class="mb-4"></app-added-total>
        <app-recipes-display class="mr-3" type="add"></app-recipes-display>
      </v-col>

    </v-row>
  </v-container>

  <!-- <div class="search">
    <div class="searchbar panel panel-success">
      <div class="panel-heading">
        <h3 class="panel-title">Search for the food you want to add!</h3>
      </div>
      <div class="panel-body">
        <div class="pull-left">
          <input
            type="text"
            class="form-control"
            placeholder="Search foods"
            ref="search"
            v-model="query"
            @keyup.enter="
                allInOne();
                setDoneAddingItem(true); 
                "
          />
        </div>
        <div class="pull-right">
          <button
            class="btn btn-success"
            @click="
              allInOne();
              setDoneAddingItem(true);
              "
          >Search</button>
          <button class="btn btn-success" @click="openRecipes">Add from My Recipes</button>
        </div>
      </div>
    </div>
    <div v-if="addingRecipe">
      <app-recipes-display type="add"></app-recipes-display>
    </div>
    <app-added-foods class="added-foods"></app-added-foods>
  </div>-->
</template>

<style scoped>
</style>

<script>
import AddedFoods from "./AddedFoods";
import AddedTotal from "./AddedTotal";
import RecipesDisplay from "./RecipesDisplay";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  mounted() {
    this.$refs.search.focus();
  },
  components: {
    appAddedFoods: AddedFoods,
    appRecipesDisplay: RecipesDisplay,
    appAddedTotal: AddedTotal
  },
  computed: {
    ...mapState("searchAndAdd", [
      "responseData",
      "nutrients",
      "addedItems",
      "focusAddedItem",
      "index"
    ]),

    ...mapState("other", ["addingRecipe"]),
    ...mapState("firebase", [
      "password",
      "email",
      "loggedIn",
      "userData",
      "userID"
    ]),
    query: {
      get() {
        return this.$store.state.searchAndAdd.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQuery", value);
      }
    },
    quantity: {
      get() {
        return this.$store.state.searchAndAdd.quantity;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQuantity", value);
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "searchFood",
      "addItem",
      "setfocusAddedItem",
      "setDoneAddingItem"
    ]),
    ...mapActions("other", ["openRecipes", "closeRecipes"]),
    ...mapActions("firebase", ["getData"]),
    updateAddedItems() {
      const data = {
        todaysItems: this.$store.state.searchAndAdd.addedItems
      };
      console.log(data);
      this.$http.patch("data/" + `${this.userID}` + ".json", data);
    },
    allInOne() {
      this.searchFood().then(this.updateAddedItems);
    }
  }
};
</script>

