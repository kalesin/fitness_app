<template>
  <div class="search">
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
  </div>
</template>

<style scoped>
.panel-body {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.pull-right {
  margin: 10px 0px;
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.pull-left {
  margin: 10px 0px;
  font-size: 12px;
  width: 100%;
}
.main {
  display: flex;
}
.search {
  width: 100%;
}
.added-foods {
  width: 100%;
}
.text {
  font-size: 1em;
}
.nutrientType {
  display: inline-block;
  width: 150px;
}

.btn-succes {
  margin: 10px;
}
</style>

<script>
import AddedFoods from "./AddedFoods.vue";
import RecipesDisplay from "./RecipesDisplay.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  mounted() {
    this.$refs.search.focus();
  },
  components: {
    appAddedFoods: AddedFoods,
    appRecipesDisplay: RecipesDisplay
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

