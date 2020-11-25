<template>
  <div>
    <div class="recipes-button">
      <button
        class="btn btn-danger"
        @click="
        checkIfDelete(entryEditIndex)
        setEntryEditIndex(-1)
        "
      >Cancel Editing</button>
    </div>
    <div class="mainFoods">
      <div class="searchbar panel panel-success">
        <div class="panel-heading">
          <h3 class="panel-title">Search for the ingredients you want to add!</h3>
        </div>
        <div class="search">
          <input
            type="text"
            ref="search"
            class="form-control"
            placeholder="Search foods"
            v-model="query"
            @keyup.enter="
          allInOne();
                setDoneAddingItem(true);"
          />

          <button
            class="btn btn-success"
            @click="
        allInOne();
                setDoneAddingItem(true);
                "
          >Search</button>
        </div>
      </div>
      <div class="total">
        <div class="panel-heading details-delete">
          <h3 class="panel-title">
            <div style="font-size: 30px">Date: {{ dailyEntries[entryEditIndex].date }}</div>
          </h3>
          <div class="pull-right2">
            <button
              class="btn-danger btn recipe-btn"
              @click="
          deleteEntry(entryEditIndex)
          setEntryEditIndex(-1)
           updateUserDailyEntry()
          "
            >Delete Entry</button>
          </div>
        </div>

        <div class="panel-body">
          <app-nutrient-box
            :nutrientArray="totalForToday"
            size="large"
            type="normal"
            total="addedItems"
          ></app-nutrient-box>
        </div>
        <div class="pull-right">
          <button
            class="btn-success btn recipe-btn"
            @click="
          saveAddedItems({entryEditIndex, addedItems, totalForToday})
          updateUserDailyEntry()
          "
            :disabled="addedItems===[]"
          >Save Changes</button>
          <button
            class="btn-danger btn recipe-btn"
            @click="
          setAddedItems(dailyEntries[entryEditIndex].items)
          "
          >Discard Changes</button>
        </div>
        <div class="panel-heading ingredients">
          <h3 class="panel-title">Foods eaten:</h3>
        </div>
      </div>
      <div class="addList col-sm-6 col-md-4">
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
              <button @click="startEdit({index})">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  enable-background="new 0 0 50 50"
                >
                  <path
                    d="M9.6 40.4l2.5-9.9L27 15.6l7.4 7.4-14.9 14.9-9.9 2.5zm4.3-8.9l-1.5 6.1 6.1-1.5L31.6 23 27 18.4 13.9 31.5z"
                  />
                  <path
                    d="M17.8 37.3c-.6-2.5-2.6-4.5-5.1-5.1l.5-1.9c3.2.8 5.7 3.3 6.5 6.5l-1.9.5z"
                  />
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
                @keyup.enter="
              onChanged({item, index})
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
            onRemoved({index})
            "
              >Remove</button>
            </div>
          </div>
        </div>
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
    }
  },
  mounted() {
    this.setAddedItems(this.dailyEntries[this.entryEditIndex].items);
    this.$refs.search.focus();
  },
  props: ["dateClicked"],
  components: {
    appNutrientBox: nutrientBox
  },
  data() {
    return {
      activeIndex: -1,
      quantity: ""
    };
  },
  computed: {
    ...mapGetters("searchAndAdd3", ["totalForToday"]),
    ...mapGetters("other", ["addedItemsTotal"]),
    ...mapState("searchAndAdd3", ["addedItems", "query", "doneAddingItem"]),
    ...mapState("other", [
      "ingredientsTemp",
      "dailyEntries",
      "entryEditIndex",
      "addedItemsTemp",
      "maintenanceCalories"
    ]),
    query: {
      get() {
        return this.$store.state.searchAndAdd3.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd3/setQuery", value);
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd3", [
      "onChanged",
      "onRemoved",
      "searchFood",
      "addItem",
      "setAddedItems",
      "setDoneAddingItem"
    ]),
    ...mapActions("other", [
      "createAddedItemsTemp",
      "saveAddedItems",
      "setEntryEditIndex",
      "setEditEntries",
      "deleteEntry"
    ]),
    startEdit(index) {
      if (this.activeIndex === index) {
        this.activeIndex = -1;
      } else {
        this.quantity = "";
        this.activeIndex = index;
        setTimeout(() => {
          this.$refs.inputAmount[0].focus();
        }, 0);
      }
    },
    allInOne() {
      this.searchFood().then(this.updateUserDailyEntry);
    },
    updateUserDailyEntry() {
      const userData = {
        dailyEntries: this.$store.state.other.dailyEntries
      };
      this.$http.patch("data/userData.json", userData);
    },
    checkIfDelete(entryEditIndex) {
      if (!this.dailyEntries[entryEditIndex].items.length) {
        this.deleteEntry(entryEditIndex);
      }
    }
  }
};
</script>

<style scoped>
.details-delete {
  display: flex;
  flex-direction: row;
}
.pull-right2 {
  margin: 10px auto;
  width: 50%;
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
.search {
  margin: 10px 0;
  justify-content: space-around;
  width: 100%;
  display: flex;
  flex-direction: row;
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