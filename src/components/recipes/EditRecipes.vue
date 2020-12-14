<template>
  <div class="mainFoods">
    <div class="total">
      <div class="panel-heading details-delete">
        <h3 class="panel-title">
          Recipe name:
          <div style="font-size: 30px">{{ recipes[editIndex].NAME }}</div>Number of Portions:
          <div style="font-size: 30px">{{ recipes[editIndex].PORTIONS }}</div>
        </h3>
        <div class="pull-right2">
          <button
            class="btn-danger btn recipe-btn"
            @click="
          removeRecipe({editIndex, userID})
          "
          >Delete Recipe</button>
        </div>
      </div>
      <div class="recipeInput">
        <input type="text" class="form-control" placeholder="Recipe name" v-model="recipesName" />
        <input
          type="number"
          class="form-control"
          step="1"
          placeholder="Portions"
          v-model="recipesPortions"
        />
      </div>

      <div class="panel-body">
        <app-nutrient-box
          :nutrientArray="totalForToday"
          size="large"
          type="normal"
          total="editRecipe"
        ></app-nutrient-box>
      </div>
      <div class="pull-right">
        <button
          class="btn-success btn recipe-btn"
          @click="
          saveIngredients({editIndex, totalForToday, addedItems, recipesName, recipesPortions, userID})
          "
          :disabled="parseFloat(recipesPortions)<=0 && recipesName==='' && addedItemsAreSame"
        >Save Changes</button>

        <!-- vedno odpre startEdit(tazadnji) ker je watcher -->
        <button
          class="btn-danger btn recipe-btn"
          @click="
          setAddedItems(recipes[editIndex].INGREDIENTS)"
        >Discard Changes</button>
      </div>
      <div class="panel-heading ingredients">
        <h3 class="panel-title">Ingredients:</h3>
      </div>
    </div>
    <div class="addList">
      <!--  <div class="panel panel-success" v-for="(item, index) in recipes" :key="index"></div> -->
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
              v-model="item.CHANGED_QUANTITY"
              @blur="setFocus(false)"
              @keyup.enter="
              onChanged({item, index, moduleIndex})
              "
            />
            <div>✕ 100g</div>
            <button
              class="btn btn-success"
              @click="
              onChanged({item, index})
              "
              :disabled="parseFloat(item.CHANGED_QUANTITY)<=0"
            >Change</button>
            <button
              class="btn btn-success"
              @click="
            onRemoved({item, index, moduleIndex})
            "
            >Remove</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-delete {
  display: flex;
  flex-direction: row;
}
.pull-right2 {
  margin: 10px auto;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.ingredients {
  margin: 0 0 10px;
  border-bottom: 1px solid green;
  border-top: 1px solid green;
  border-radius: 5px;
}
.recipeInput {
  display: flex;
  justify-content: space-around;
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
.pull-right {
  margin: 10px auto;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.btn {
  width: 20%;

  justify-content: center;
}
.recipe-btn {
  width: 30%;
}
.form-control {
  width: 25%;
}
.panel {
  margin: 0;
}
svg {
  width: 20px;
}
</style>

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
      quantity: "",
      moduleIndex: 4
    };
  },
  computed: {
    ...mapGetters("searchAndAdd4", ["totalForToday"]),
    ...mapGetters("other", ["ingredientsTotal"]),
    ...mapState("searchAndAdd4", [
      "addedItems",
      "doneAddingItem",
      "idx",
      "responseCount",
      "focus"
    ]),
    ...mapState("other", [
      "recipes",
      "editIndex",
      "showRecipe",
      "ingredientsTemp"
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
    addedItemsAreSame() {
      console.log(JSON.stringify(this.recipes[this.editIndex].INGREDIENTS))
      console.log(JSON.stringify(this.addedItems))
      console.log(JSON.stringify(this.recipes[this.editIndex].INGREDIENTS) ===
        JSON.stringify(this.addedItems))
      if (
        JSON.parse(JSON.stringify(this.recipes[this.editIndex].INGREDIENTS)) ===
        JSON.parse(JSON.stringify(this.addedItems))
      ) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd4", [
      "onChanged",
      "onRemoved",
      "setAddedItems",
      "setFocus"
    ]),
    ...mapActions("other", [
      "addToRecipes",
      "nameRecipe",
      "setPortions",
      "changeRecipeName",
      "changeRecipePortions",
      "changeRecipeIngredient",
      "saveIngredients",
      "removeRecipe",
      "setEditIndex",
      "removeIngredient",
      "createIngredientsTemp"
    ]),
    startEdit(index) {
      if (this.activeIndex === index && !this.focus) {
        this.activeIndex = -1;
      } else {
        this.quantity = "";
        this.activeIndex = index;
        setTimeout(() => {
          this.$refs.inputAmount[0].focus();
        }, 0);
      }
    }
  }
};
</script>