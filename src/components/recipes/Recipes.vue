<template>

      <div class="right-container">
        <app-recipes-display type="edit" v-if="showRecipe"></app-recipes-display>
        <div class="recipes-button">
          <button
            class="btn btn-success"
            v-if="!showRecipe"
            @click="
        showRecipes(true)
        "
          >Edit My Recipes</button>
          <button
            class="btn btn-danger"
            v-else
            @click="
        setEditIndex(-1)
        showRecipes(false)
        "
          >Cancel Editing</button>
        </div>
        
        <div class="searchbar panel panel-success">
          <div class="panel-heading">
            <h3 class="panel-title">Search for the ingredients you want to add!</h3>
          </div>
          <div v-if="editIndex===-1" class="panel-body">
            <div class="pull-left">
              <input
                type="text"
                class="form-control"
                placeholder="Search foods"
                v-model="query"
                ref="search"
                @keyup.enter="
              allInOne();
              setDoneAddingItem(true);
              "
              />
            </div>
            <div class="pull-right">
              <button
                class="btn btn-success"
                @click="allInOne();
              setDoneAddingItem(true);"
              >Search</button>
            </div>
          </div>
          <div v-else class="panel-body">
            <div class="pull-left">
              <input
                type="text"
                class="form-control"
                placeholder="Search foods"
                v-model="query2"
                @keyup.enter="
              allInOne4();
              setDoneAddingItem4(true);
              "
              />
            </div>
            <div class="pull-right">
              <button
                class="btn btn-success"
                @click="allInOne4();
              setDoneAddingItem4(true);"
              >Search</button>
            </div>
          </div>
        </div>
        
      <app-edit-recipes v-if="!(editIndex===-1)"></app-edit-recipes>
      <app-added-recipes class="added-foods" v-else></app-added-recipes>
      </div>
      
    
</template>

<style scoped>
.right-container {
  width: 100%;
}
.recipes-button {
  width: 100%;
  margin: 0 0 10px;
}
.main {
  display: flex;
  flex-direction: column;
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
.pull-left {
  font-size: 12px;
}
.searchbar {
}
.item {
}
.btn-danger {
  margin: 10px 0;
}
.pull-left {
  width: 55%;
}
</style>

<script>
import AddedRecipes from "./AddedRecipes.vue";
import EditRecipes from "./EditRecipes.vue";
import RecipesDisplay from "../calories/RecipesDisplay.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  mounted() {
    this.getData();
    this.$refs.search.focus();
  },
  components: {
    appAddedRecipes: AddedRecipes,
    appRecipesDisplay: RecipesDisplay,
    appEditRecipes: EditRecipes
  },
  computed: {
    ...mapState("searchAndAdd2", [
      "responseData",
      "nutrients",
      "itemToAdd",
      "doneAddingItem"
    ]),
    ...mapState("searchAndAdd4", {
      itemToAdd4: "itemToAdd",
      doneAddingItem4: "doneAddingItem"
    }),
    ...mapState("other", ["showRecipe", "editIndex", "recipes"]),
   ...mapState("firebase", ["password", "email", "loggedIn", "userData", "userID"]),
    query: {
      get() {
        return this.$store.state.searchAndAdd2.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd2/setQuery", value);
      }
    },
    query2: {
      get() {
        return this.$store.state.searchAndAdd4.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd4/setQuery", value);
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd2", [
      "searchFood",
      "addItem",
      "setDoneAddingItem"
    ]),
    ...mapActions("searchAndAdd4", {
      addItem4: "addItem",
      searchFood4: "searchFood",
      setDoneAddingItem4: "setDoneAddingItem"
    }),
    ...mapActions("other", ["showRecipes", "addIngredient", "setEditIndex"]),
    ...mapActions("firebase", ["getData"]),
    updateRecipeItems() {
      const data = {
        currentRecipeItems: this.$store.state.searchAndAdd2.addedItems
      };
      this.$http.patch("data/"+`${this.userID}`+".json", data);
    },
    allInOne() {
      this.searchFood().then(this.updateRecipeItems);
    },
    allInOne4() {
      this.searchFood4();
    },
    createItemToAdd4(value) {
      this.$store.commit("searchAndAdd4/ITEM_TO_ADD", value);
    }
  }
};
</script>

