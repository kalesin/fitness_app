<template>
  <v-card flat tile class="light-green lighten-3 d-flex rounded-lg pl-2 pt-2 flex-column">
    <v-list rounded class="light-green lighten-3 pb-0 mb-0">
      <v-list-item-group v-model="selectedItem">
        <div v-for="(item, index) in choiceArray" :key="index">
          <v-list-item
            class="pl-1 mb-2 light-green lighten-4 light-green--text dropZone"
            style="width: 250px"
            @click="setItemsIndex(index)"
            @dragenter="dropEnterClass(index)"
            @dragleave="dropLeaveClass(index)"
            @dragover.prevent
            @drop="onDrop(index)"
          >
            <v-list-item-icon class="noEvents" x-large>
              <v-icon class="mx-4 gray">mdi-plus-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-h5 noEvents">{{choiceArray[index]}}</v-list-item-title>
            <div class="noEvents">
              <v-icon v-if="items[itemsPropNames[index]].length==0">mdi-numeric-0-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length==1">mdi-numeric-1-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length==2">mdi-numeric-2-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length==3">mdi-numeric-3-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length==4">mdi-numeric-4-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length==5">mdi-numeric-5-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length==6">mdi-numeric-6-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length==7">mdi-numeric-7-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length==8">mdi-numeric-8-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length==9">mdi-numeric-9-circle</v-icon>
              <v-icon v-if="items[itemsPropNames[index]].length>9">mdi-numeric-9-plus-circle</v-icon>
            </div>
          </v-list-item>
          <MealCard
            v-if="itemsIndex==index"
            :itemsIndex="itemsIndex"
            @dragStart="setDragging(true)"
            @dragEnd="setDragging(false)"
          ></MealCard>
        </div>
      </v-list-item-group>
    </v-list>
    <v-divider class="ml-n2 my-2 pr-2"></v-divider>
    <MealCard :itemsIndex="4"></MealCard>
  </v-card>
</template>

<script>
import NutrientBox from "./NutrientBox";
import MealCard from "./MealCard";
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";

import EntryDialogue from "./EntryDialogue";

export default {
  mounted() {
    let index = this.dailyEntries.findIndex(element => {
      element.date === this.today;
    });
    if (index != -1) {
      this.setEntryTodayIndex(index);
    } else {
      this.setEntryTodayIndex(-1);
    }
  },
  components: {
    MealCard
  },
  data() {
    return {
      choiceArray: ["Breakfast", "Lunch", "Dinner", "Snack"],
      selectedItem: -1,
      dragging: false,
    };
  },
  watch: {
    items: {
      handler() {
        this.setAddedItems([]);
        let array = [];
        for (let j = 0; j < 5; j++) {
          let itemArray = JSON.parse(
            JSON.stringify(this.items[this.itemsPropNames[j]])
          );
          for (let i = 0; i < itemArray.length; i++) {
            let same = array.findIndex(
              element => element.NAME === itemArray[i].NAME
            );
            if (same != -1) {
              array[same].QUANTITY += itemArray[i].QUANTITY;
              array[same].CALCULATED_NUTRIENTS = array[same].NUTRIENTS.map(
                x => Math.round(x * array[same].QUANTITY * 100) / 100
              );
            } else if (same == -1) {
              array.push(itemArray[i]);
            }
          }
        }
        this.setAddedItems(array);
        this.updateAddedItems();
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapState("searchAndAdd", [
      "addedItems",
      "idx",
      "responseCount",
      "focus",
      "itemsIndex",
      "items",
      "itemsPropNames"
    ]),
    ...mapState("other", ["dailyEntries"]),
    ...mapState("firebase", ["userID"]),
    today() {
      return dayjs().format("YYYY-MM-DD");
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
      "onChanged",
      "onRemoved",
      "setFocus",
      "setItemsIndex",
      "setAddedItems",
      "addItem"
    ]),
    ...mapActions("other", ["setEntryTodayIndex"]),
    updateAddedItems() {
      const data = {
        todaysAddedItems: this.addedItems
      };
      this.$http.patch("data/" + `${this.userID}` + ".json", data);

      const todaysItems = {
        breakfast: this.items[this.itemsPropNames[0]],
        lunch: this.items[this.itemsPropNames[1]],
        dinner: this.items[this.itemsPropNames[2]],
        snack: this.items[this.itemsPropNames[3]],
        unsorted: this.items[this.itemsPropNames[4]]
      };
      this.$http.patch(
        "data/" + `${this.userID}` + "/todaysItems.json",
        todaysItems
      );
    },
    onDrop(index) {
      console.log("drop");
      document
        .getElementsByClassName("dropZone")
        [index].classList.remove("dropHover");
    },
    dropEnterClass(index) {
      console.log("enter");
      console.log(index)
      console.log(document.getElementsByClassName("dropZone")[index]);
      document
        .getElementsByClassName("dropZone")
        [index].classList.add("dropHover");
    },
    dropLeaveClass(index) {
      console.log("leave");
      console.log(document.getElementsByClassName("dropZone")[index]);
      document
        .getElementsByClassName("dropZone")
        [index].classList.remove("dropHover");
    },
    setDragging(value, index) {
      this.dragging = value;
      console.log(this.dragging);
    }
  }
};
</script>


<style scoped>
.dropZone > [aria-selected="false"]{
background-color: red !important;
  color: red !important;
}
.hover {
  background-color: #eeeeee;
  opacity: 0.8;
}
.dropHover {
  background-color: red !important;
  color: red !important;
}
.noEvents {
  pointer-events: none;
}
</style>