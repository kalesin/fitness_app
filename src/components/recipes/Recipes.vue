<template>
  <div class="main">
    <div class="search col-sm-6 col-md-4">
      <div class="searchbar panel panel-success">
        <div class="panel-heading">
          <h3 class="panel-title">Search for the ingredients you want to add!</h3>
        </div>
        <div class="panel-body">
          <div class="pull-left">
            <input
              type="text"
              class="form-control"
              placeholder="Search foods"
              v-model="query"
              @keyup.enter="search"
            />
          </div>
          <div class="pull-right">
            <button class="btn btn-success" @click="search">Search</button>
          </div>
        </div>
      </div>

      <div v-if="responseData" class="item panel panel-success">
        <div class="panel-heading">
          <h3 class="panel-title" style="text-transform: capitalize;">{{nutrients.NAME}}(per 100g)</h3>
        </div>
        <div class="panel-body">
          <div class="text">
            <div class="nutrientType">Energy:</div>
            {{nutrients.ENERGY}} kcal
            <hr />
            <div class="nutrientType">Protein:</div>
            {{nutrients.PROTEIN}} g
            <hr />
            <div class="nutrientType">Carbohydrates:</div>
            {{nutrients.CARB}} g
            <hr />
            <div class="nutrientType">Fats:</div>
            {{nutrients.FAT}} g
            <hr />
            <div class="nutrientType">Fiber:</div>
            {{nutrients.FIBER}} g
            <hr />
          </div>
          <div v-if="editIndex===-1">
            <div class="pull-left">
              Amount in multiples of 100g
              <input
                ref="inputAmount"
                type="number"
                step="0.5"
                class="form-control"
                placeholder="X 100g"
                v-model="quantity"
                @keyup.enter="addItem"
              />
            </div>
            <div class="pull-right">
              <button
                class="btn btn-success"
                @click="addItem"
                :disabled="parseFloat(quantity)<=0 || isNaN(parseFloat(quantity))"
              >{{'Add'}}</button>
            </div>
          </div>
          <div v-else>
            <div class="pull-left">
              Amount in multiples of 100g
              <input
                ref="inputAmount"
                type="number"
                step="0.5"
                class="form-control"
                placeholder="X 100g"
                v-model="quantity"
                @keyup.enter="addIngredient({editIndex, itemToAdd})"
              />
            </div>
            <div class="pull-right">
              <button
                class="btn btn-success"
                @click="addIngredient({editIndex, itemToAdd})"
                :disabled="parseFloat(quantity)<=0 || isNaN(parseFloat(quantity))"
              >{{'Add'}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-container">
      <div class="recipes-button">
        <button class="btn btn-success" v-if="!showRecipe" @click="
        showRecipes(true)
        ">Edit My Recipes</button>
        <button class="btn btn-danger" v-else @click="
        setEditIndex(-1)
        showRecipes(false)
        ">Cancel Editing</button>
      </div>
      <app-recipes-display type="edit" v-if="showRecipe"></app-recipes-display>
      <app-edit-recipes v-if="!(editIndex===-1)"></app-edit-recipes>
      <app-added-recipes class="added-foods" v-else></app-added-recipes>
    </div>
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
}
.search {
  width: 30%;
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
.danger {
  border: 1px solid red;
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
  components: {
    appAddedRecipes: AddedRecipes,
    appRecipesDisplay: RecipesDisplay,
    appEditRecipes: EditRecipes
  },
  computed: {
    ...mapState("searchAndAdd2", ["responseData", "nutrients", "itemToAdd"]),
    ...mapState("other", ["showRecipe", "editIndex", "recipes"]),
    query: {
      get() {
        return this.$store.state.searchAndAdd2.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd2/setQuery", value);
      }
    },
    quantity: {
      get() {
        return this.$store.state.searchAndAdd2.quantity;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd2/setQuantity", value);
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd2", ["searchFood", "addItem"]),
    ...mapActions("other", ["showRecipes", "addIngredient", "setEditIndex"]),
    search() {
      this.searchFood().then(response => {
        setTimeout(() => {
          console.log("a");
          this.$refs.inputAmount.focus();
        }, 0);
      });
    }
  }
};
</script>

