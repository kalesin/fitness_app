<template>
  <div class="mainFoods">
    <div class="addList">
      <div class="panel panel-success" v-for="(item, index) in addedItems" :key="index">
        <div class="panel-heading">
          <h3
            class="panel-title"
            style="text-transform: capitalize;"
          >{{item.NAME}} ({{item.QUANTITY*100}}g)</h3>
        </div>
        <div class="panel-body">
          <div style="display:flex; width:100%">
            <app-nutrient-box
              :nutrientArray="item.CALCULATED_NUTRIENTS"
              size="small"
              type="normal"
              style="flex-grow: 1"
            ></app-nutrient-box>
            <button @click="startEdit(index)">
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
          <div v-if="activeIndex == index" class="pull-left">
            <input
              ref="inputAmount"
              type="number"
              class="form-control"
              step="0.5"
              placeholder="Amount"
              v-model="quantity"
              @blur="setFocus(false)"
              @keyup.enter="
              onChanged({item, index, userID, moduleIndex, quantity})"
            />
            <div>✕ 100g</div>
            <button
              class="btn btn-success"
              @click="
              onChanged({item, index, userID, moduleIndex, quantity})"
              :disabled="parseFloat(quantity)<=0 || quantity === ''"
            >Change</button>
            <button
              class="btn btn-success"
              @click="
            onRemoved({index, userID, moduleIndex})"
            >Remove</button>
          </div>
        </div>
      </div>
    </div>
    <div class="total">
      <div class="panel-heading">
        <h3 class="panel-title">Recipe total:</h3>
      </div>
      <div class="panel-body">
        <app-nutrient-box :nutrientArray="totalForToday" size="large" type="normal" total="recipe"></app-nutrient-box>
      </div>
      <div class="recipeInput">
        <input type="text" class="form-control" placeholder="Recipe name" v-model="recipesName" />
        <input
          type="number"
          class="form-control"
          step="1"
          placeholder="Servings"
          v-model="recipesPortions"
        />
        <button
          class="btn btn-success"
          @click=" 
             addToRecipes({totalForToday, addedItems, recipesName, recipesPortions, userID})
              "
          :disabled="parseFloat(recipesPortions)<=0 || recipesName === '' || addedItems.length == 0"
        >Add Recipe</button>
      </div>
    </div>
  </div>
</template>

<script>
import nutrientBox from "../calories/nutrientBox.vue";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  watch: {
    addedItems: {
      handler() {
        if (this.doneAddingItem) {
          this.startEdit(this.addedItems.length - 1);
        }
      }
    },
    responseCount: {
      handler() {
        if (this.idx > -1) {
          this.startEdit(this.idx);
        }
      }
    }
  },
  components: {
    appNutrientBox: nutrientBox
  },
  data() {
    return {
      activeIndex: -1,
      moduleIndex: 2
    };
  },
  computed: {
    ...mapGetters("searchAndAdd2", ["totalForToday"]),
    ...mapState("searchAndAdd2", [
      "addedItems",
      "doneAddingItem",
      "idx",
      "responseCount",
      "focus"
    ]),
    ...mapState("firebase", [
      "password",
      "email",
      "loggedIn",
      "userData",
      "userID"
    ]),
     recipesPortions: {
      get() {
        return this.$store.state.other.recipesPortions;
      },
      set(value) {
        this.$store.dispatch("other/setPortions", value);
      }
    },
    recipesName: {
      get() {
        return this.$store.state.other.recipesName;
      },
      set(value) {
        this.$store.dispatch("other/nameRecipe", value);
      }
    },
    quantity: {
      get() {
        return this.$store.state.searchAndAdd2.quantity;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd2/setQuantity", value);
      }
    },
  },
  methods: {
    ...mapActions("searchAndAdd2", ["onChanged", "onRemoved", "setFocus"]),
    ...mapActions("other", ["addToRecipes", "nameRecipe", "setPortions"]),
    startEdit(index) {
      if (this.activeIndex == index && !this.focus) {
        this.activeIndex = -1;
      } else {
        this.quantity = "";
        this.activeIndex = index;
        setTimeout(() => {
          this.$refs.inputAmount[0].focus();
        }, 0);
      }
    },
  }
};
</script>


<style scoped>
.recipeInput {
  display: flex;
  justify-content: space-between;
  margin: 10px;
}
.mainFoods {
  width: 100%;
  position: relative;
  border: 1px solid green;
  border-radius: 5px;
  overflow: hidden;
}
.addList {
  width: 100%;
  height: 600px;
  flex-direction: column;
  padding: 0;
  overflow: auto;
  flex-wrap: wrap;
}
.total {
  /* 
  position: absolute;
  bottom: 0; */
  width: 100%;
  margin: 0px;
  display: flex;
  border-color: #d6e9c6;
  flex-direction: column;
}
.panel-heading {
  background-color: #dff0d8;
}
.pull-left {
  margin: 10px 0px;
  justify-content: space-between;
  width: 100%;
  display: flex;
  align-items: center;
}
.btn {
  width: 25%;
}
.form-control {
  width: 30%;
}
.panel {
  margin: 0;
}
svg {
  width: 20px;
}
</style>