<template>
  <v-card flat tile class="light-green lighten-3 d-flex rounded-lg pl-2 pt-2 flex-column">
    <div v-for="(item, index) in choiceArray" :key="index" class="mb-2 d-flex flex-column">
      <div
        class="d-flex justify-space-between rounded-xl normalColor dropZone"
        style="width: 300px;"
        @click="setItemsIndex(index)"
        @dragenter="dragEnterClass(index)"
        @dragleave="dragLeaveClass(index)"
        @dragover.prevent
        @drop="onDrop({dropIndex: index, dragIndex, userID, moduleIndex})"
        v-ripple
        :class="{ 'activeColor': itemsIndex==index, 'hoverColor': itemsIndex !== index && hoverIndex === index }"
      >
        <v-btn icon large class="mx-4 my-3 noEvents btn1">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
        <p class="text-h5 my-4 noEvents">{{choiceArray[index]}}</p>
        <v-btn class="mx-4 mt-3 noEvents btn2" icon large>
          <v-icon v-if="items[itemsPropNames[index]].length > 9">mdi-numeric-9-plus-circle</v-icon>
          <v-icon v-else>{{ `mdi-numeric-${items[itemsPropNames[index]].length}-circle` }}</v-icon>
        </v-btn>
      </div>
      <MealCard v-if="itemsIndex==index" :itemsIndex="itemsIndex"></MealCard>
    </div>
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

    this.dragEndListener = document.addEventListener('dragend', ev => {
      this.hoverIndex = -1
    })
  },
  destroyed() {
    if (this.dragEndListener) {
      document.removeEventListener('dragend', this.dragEndListener)
      this.dragEndListener = null
    }
  },
  components: {
    MealCard
  },
  data() {
    return {
      choiceArray: ["Breakfast", "Lunch", "Dinner", "Snack"],
      removedIndex: -1,
      moduleIndex: 1,
      hoverIndex: -1,
      activeIndex: -1,
    };
  },
  watch: {
    items: {
      handler() {
        this.setAddedItems([]);
        let array = [];
        for (let j = 0; j < 4; j++) {
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
                x => Math.round(x * array[same].QUANTITY) / 100
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
      "itemsPropNames",
      "dragIndex"
    ]),
    ...mapState("other", ["dailyEntries"]),
    ...mapState("firebase", ["userID"]),
    today() {
      return dayjs().format("YYYY-MM-DD");
    },
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "setItemsIndex",
      "setAddedItems",
      "addItem",
      "createAndAddRemovedItem",
      "onRemoved"
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
      };
      //tuki ne spremeni
      this.$http.patch(
        "data/" + `${this.userID}` + "/todaysItems.json",
        todaysItems
      );
    },
    //drag and drop events
    onDrop({ dropIndex, userID, moduleIndex, dragIndex}) {
      //data

      if (this.itemsIndex != dropIndex) {
        this.onRemoved({ index: dragIndex, userID, moduleIndex });
        this.setItemsIndex(dropIndex);
        this.addItem(moduleIndex);
      }

      //css
      this.hoverIndex = - 1
      this.activeIndex = dropIndex
    },
    dragEnterClass(index) {
      this.hoverIndex = index
      if (document.getElementsByClassName("activeColor")[index]) {
        this.removedIndex = index;
        this.activeIndex = -1
      }
    },
    dragLeaveClass(index) {
      this.hoverIndex = - 1
    },
  }
};
</script>


<style scoped>
.normalColor {
  background-color: #dcedc8;
}
.activeColor {
  background-color: #7cbe30;
}
.hoverColor {
  background-color: rgb(195, 22, 22) !important;
}

.activeBtn {
  background-color: #7cbe30;
}
.hoverBtn {
  background-color: rgb(195, 22, 22) !important;
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

.dropZone.hoverBtn > .btn1 {
}
.dropZone.hoverBtn > .btn2 {
}
.dropZone.activeBtn > .btn1 {
}
.dropZone.activeBtn > .btn2 {
}
</style>