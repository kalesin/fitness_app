<template>
  <div class="main">
    <div class="search col-sm-6 col-md-4">
      <div class="searchbar panel panel-success">
        <div class="panel-heading">
          <h3 class="panel-title">Search for the food you want to add!</h3>
        </div>
        <div class="panel-body">
          <div style="margin: 10px 0px;">
            <div class="pull-left">
              <input
                type="text"
                class="form-control"
                placeholder="Search foods"
                v-model="query"
                @keyup.enter="
                search"
              />
            </div>
            <div class="pull-right">
              <button class="btn btn-success" 
              @click="
              search">Search</button>
            </div>
          </div>
          <div class="recipes-button">
            <button class="btn btn-success" @click="openRecipes">Add from My Recipes</button>
          </div>
        </div>
      </div>

      <div v-if="responseData && !addingRecipe" class="item panel panel-success">
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
      </div>
      <div v-if="addingRecipe && !responseData">
        <app-recipes-display type="add">
        </app-recipes-display>
      </div>
    </div>
    <app-added-foods class="added-foods"></app-added-foods>
  </div>
</template>

<style scoped>
.panel-body {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.recipes-button {
  margin: 10px 0px;
  display: flex;
  justify-content: center;
  width: 100%;
}
.main {
  display: flex;
}
.search {
  width: 30%;
}
.added-foods {
  width: 70%;
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
import AddedFoods from "./AddedFoods.vue";
import RecipesDisplay from "./RecipesDisplay.vue"
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {
    appAddedFoods: AddedFoods,
    appRecipesDisplay: RecipesDisplay
  },
  computed: {
    ...mapState("searchAndAdd", ["responseData", "nutrients"]),

    ...mapState("other", ["addingRecipe"]),
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
    },
  },
  methods: {
    ...mapActions("searchAndAdd", ["searchFood", "addItem"]),
    ...mapActions("other", ["openRecipes", "closeRecipes"]),
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

