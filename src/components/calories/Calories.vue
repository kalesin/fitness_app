<template>
  <div class="main">
    <div class="search col-sm-6 col-md-4">
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
              v-model="query"
              @keyup.enter="searchFood"
            />
          </div>
          <div class="pull-right">
            <button class="btn btn-success" @click="searchFood">Search</button>
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
              :disabled="parseFloat(quantity)<=0"
            >{{'Add'}}</button>
          </div>
        </div>
      </div>
    </div>
    <app-added-foods
      class="added-foods"
      :addedItems="addedItems"
      :totalForToday="totalForToday"
      @changed="onChanged"
      @removed="onRemoved"
    ></app-added-foods>
  </div>
</template>

<style scoped>
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

export default {
  data() {
    return {
      api_key: "4d036c5868dfd862b3d383c4e2d872fc",
      api_id: "8f153d95",
      api_url: "https://api.edamam.com/api/food-database/v2/parser?",
      query: "",
      responseData: 0,
      quantity: "",
      nutrients: 0,
      nutrientsArray: [],
      addedItems: [],
      totalNutrients: []
    };
  },
  components: {
    appAddedFoods: AddedFoods
  },
  computed: {
    totalForToday: function() {
      let totalNutrient = [];
      for (let j = 0; j < 5; j++) {
        totalNutrient[j] = 0;
        for (let i = 0; i < this.addedItems.length; i++) {
          totalNutrient[j] += this.addedItems[i].CALCULATED_NUTRIENTS[j];
        }
        totalNutrient[j]= Math.round(totalNutrient[j] * 100) / 100;
      }
      console.log(totalNutrient);
      return totalNutrient;
    }
  },
  methods: {
    searchFood() {
      this.$http
        .get(
          `${this.api_url}ingr=${this.query}&app_id=${this.api_id}&app_key=${this.api_key}`
        )
        .then(
          response => {
            this.responseData = response.body.parsed[0].food;
            this.nutrients = {
              NAME: this.responseData.label,
              ENERGY: this.responseData.nutrients.ENERC_KCAL || 0,
              CARB: this.responseData.nutrients.CHOCDF || 0,
              FAT: this.responseData.nutrients.FAT || 0,
              FIBER: this.responseData.nutrients.FIBTG || 0,
              PROTEIN: this.responseData.nutrients.PROCNT || 0
            };
            this.nutrientsArray = [
              this.nutrients.ENERGY,
              this.nutrients.PROTEIN,
              this.nutrients.CARB,
              this.nutrients.FAT,
              this.nutrients.FIBER
            ];
            setTimeout(() => {
              this.$refs.inputAmount.focus();
            }, 0);

            console.log(this.nutrients);
          },
          response => {
            console.log(response.body);
          }
        );
    },
    addItem() {
      this.addedItems.push({
        NAME: this.nutrients.NAME,
        NUTRIENTS: this.nutrientsArray,
        QUANTITY: parseFloat(this.quantity),
        CHANGED_QUANTITY: "",
        CALCULATED_NUTRIENTS: this.nutrientsArray.map(
          x => Math.round(x * this.quantity * 100) / 100
        )
      });
      this.quantity = 0;
      console.log(this.addedItems);
    },
    onChanged({ item, index }) {
      item.QUANTITY = item.CHANGED_QUANTITY;
      item.CHANGED_QUANTITY = 0;

      item.CALCULATED_NUTRIENTS = item.NUTRIENTS.map(
        x => Math.round(x * item.QUANTITY * 100) / 100
      );

      this.addedItems[index] = item;
      console.log(this.addedItems);
    },
    onRemoved({ index }) {
      this.addedItems.splice(index, 1);
    }
  }
};
</script>

