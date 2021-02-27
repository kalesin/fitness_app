<template>
  <v-card flat tile class="light-green lighten-3 d-flex rounded-lg pl-2 pt-2 flex-column">
    <div v-for="(item, index) in choiceArray" :key="index" class="mb-2 d-flex flex-column">
      <div
        class="d-flex justify-space-between rounded-xl normalColor dropZone"
        style="width: 300px;"
        @click="setItemsIndex(index)"
        @dragenter="dropEnterClass(index)"
        @dragleave="dropLeaveClass(index)"
        @dragover.prevent
        @drop="onDrop(index)"
        v-ripple
        :class="{activeColor: itemsIndex==index}"
      >
        <v-btn icon :class="{activeBtn: itemsIndex==index}" large class="mx-4 my-3 noEvents btn1">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
        <p class="text-h5 my-4 noEvents">{{choiceArray[index]}}</p>
        <v-btn class="mx-4 mt-3 noEvents btn2" :class="{activeBtn: itemsIndex==index}" icon large>
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
        </v-btn>
      </div>
      <MealCard v-if="itemsIndex==index" :itemsIndex="itemsIndex"></MealCard>
    </div>
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
      removedActive: -1
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
      if (this.itemsIndex != index) {
        this.setItemsIndex(index);
      }

      document
        .getElementsByClassName("dropZone")
        [index].classList.remove("hoverColor");
      document
        .getElementsByClassName("btn1")
        [index].classList.remove("hoverBtn");
      document
        .getElementsByClassName("btn2")
        [index].classList.remove("hoverBtn");

      document
        .getElementsByClassName("dropZone")
        [index].classList.add("activeColor");
      document.getElementsByClassName("btn1")[index].classList.add("activeBtn");
      document.getElementsByClassName("btn2")[index].classList.add("activeBtn");
    },
    dropEnterClass(index) {
      console.log("enter");
      document
        .getElementsByClassName("dropZone")
        [index].classList.add("hoverColor");
      document.getElementsByClassName("btn1")[index].classList.add("hoverBtn");
      document.getElementsByClassName("btn2")[index].classList.add("hoverBtn");

      if (document.getElementsByClassName("activeColor")[index]) {
        this.removedActive = index;
        document
          .getElementsByClassName("dropZone")
          [index].classList.remove("activeColor");
        document;
        document
          .getElementsByClassName("btn1")
          [index].classList.remove("activeBtn");
        document
          .getElementsByClassName("btn2")
          [index].classList.remove("activeBtn");
      }
    },
    dropLeaveClass(index) {
      console.log("leave");
      document
        .getElementsByClassName("dropZone")
        [index].classList.remove("hoverColor");
      document
        .getElementsByClassName("btn1")
        [index].classList.remove("hoverBtn");
      document
        .getElementsByClassName("btn2")
        [index].classList.remove("hoverBtn");

      if (index == this.removedActive) {
        document
          .getElementsByClassName("dropZone")
          [index].classList.add("activeColor");
        document
          .getElementsByClassName("btn1")
          [index].classList.add("activeBtn");
        document
          .getElementsByClassName("btn2")
          [index].classList.add("activeBtn");
      }
    },
    addActiveColor(){

    },
    addHoverColor(){

    },
    removeActiveColor(){

    },
    removeHoverColor(){
      
    }
  }
};
</script>


<style scoped>
.normalColor {
  background-color: #dcedc8;
}
.activeColor {
  background-color: #7cbe30;
  color: #8ed141 !important;
}
.hoverColor {
  background-color: rgb(195, 22, 22) !important;
  color: rgb(255, 100, 100) !important;
}

.activeBtn {
  background-color: #7cbe30;
  color: #8ed141 !important;
}
.hoverBtn {
  background-color: rgb(195, 22, 22) !important;
  color: rgb(255, 100, 100) !important;
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