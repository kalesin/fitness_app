<template>
  <div
    flat
    tile
    class="light-green lighten-3 d-flex flex-wrap rounded-lg"
    :class="{'': itemsIndex==4}"
    style="width: 100%"
  >
    <div
      v-for="(item, index) in items[itemsPropNames[itemsIndex]]"
      :key="index"
      class="itemCard pa-2 pb-0 pl-0"
    >
      <div class="rounded-lg clickbox" @click="setActiveIndex(index)" v-ripple>
        <v-card
          style="width: 100%"
          outlined
          class="lime accent-1 rounded-lg"
          draggable="true"
          @dragstart="dragStart(index)"
        >
          <div class="d-flex">
            <v-card-text
              style="text-transform: capitalize; text-align: center; line-height: 100px; height: 100px"
              class="text-h5 pa-0 justify-end align-end flex-grow-1 textWidth"
            >{{item.NAME}}</v-card-text>
            <div class="d-flex flex-column pt-2 pr-2" style="width: 125px">
              <div class="d-flex justify-end pr-0">
                <v-btn class="justify-end" large icon>
                  <v-icon v-if="activeIndex!=index" class="mr-2">mdi-pencil-outline</v-icon>
                  <v-icon v-else class="mr-2">mdi-pencil-off-outline</v-icon>
                </v-btn>
                <v-btn
                  class="justify-end"
                  icon
                  large
                  color="red"
                  @click="
            onRemoved({index, userID, moduleIndex})"
                >
                  <v-icon class="mr-2">mdi-delete</v-icon>
                </v-btn>
              </div>
              <div style="height: 50px">
                <v-card-text
                  v-if="activeIndex!=index"
                  style="padding-top: 10px; font: inherit; font-size:16px; padding-left: 48px; font-weight: 400; letter-spacing: 0em"
                >
                  <div v-if="item.IS_PORTION === false">x {{item.QUANTITY}}g</div>
                  <div v-else>x {{item.QUANTITY/100}} por.</div>
                </v-card-text>
                <div v-else class="d-flex justify-space-around">
                  <v-btn
                    class="mr-1"
                    icon
                    large
                    color="green"
                    @click="
              onChanged({item, index, userID, moduleIndex, quantity})"
                    :disabled="parseFloat(quantity)<=0 || quantity === ''"
                  >
                    <v-icon>mdi-check-bold</v-icon>
                  </v-btn>
                  <v-text-field
                    class="mt-2 mr-1"
                    dense
                    ref="inputAmount"
                    type="number"
                    step="0.5"
                    v-model="quantity"
                    @keyup.enter="
              onChanged({item, index, userID, moduleIndex, quantity})"
                  ></v-text-field>
                </div>
              </div>
            </div>
          </div>
          <NutrientBox :nutrientArray="item.CALCULATED_NUTRIENTS" class="ma-2 mt-0"></NutrientBox>
        </v-card>
      </div>
    </div>
  </div>
</template> 

<script>
import NutrientBox from "./NutrientBox";
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";

import EntryDialogue from "./EntryDialogue";

export default {
  props: ["itemsIndex"],
  mounted() {
    let index = this.dailyEntries.findIndex(element => {
      element.date === this.today;
    });
    if (index != -1) {
      this.setEntryTodayIndex(index);
    } else {
      this.setEntryTodayIndex(-1);
    }
    window.addEventListener("mouseup", this.clickIndexHandler);
  },
  components: {
    NutrientBox
  },
  data() {
    return {
      moduleIndex: 1,
      choiceArray: ["Breakfast", "Lunch", "Dinner", "Snack"]
    };
  },
  watch: {
    activeIndex: {
      handler() {
        if (this.activeIndex != -1) {
          setTimeout(() => {
            if (this.$refs.inputAmount) {
              this.$refs.inputAmount[0].focus();
            }
          }, 0);
        }
      }
    }
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapState("searchAndAdd", ["addedItems", "items", "itemsPropNames"]),
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
    },
    activeIndex: {
      get() {
        return this.$store.state.searchAndAdd.activeIndex;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setActiveIndex", value);
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "onChanged",
      "onRemoved",
      "dragAndDropItem",
      "setActiveIndex"
    ]),
    ...mapActions("other", ["setEntryTodayIndex"]),
    dragStart(index) {
      this.$emit("dragStart", true);
      this.dragAndDropItem({
        item: this.items[this.itemsPropNames[this.itemsIndex]][index],
        index
      });
    },
    clickIndexHandler(e) {
      if (this.activeIndex != -1) {
        if (
          document
            .getElementsByClassName("clickbox")
            [this.activeIndex].contains(e.target)
        ) {
        } else {
          this.setActiveIndex(-1);
        }
      }
    }
  }
};
</script>

<style scoped>
.borderRadius {
  border-radius: 20px;
}
.hover {
  background-color: #eeeeee;
  opacity: 0.8;
}
.textWidth {
  width: calc(100% - 125px);
}
.itemCard {
  width: calc(100% / 3) !important;
  user-select: none;
}
@media only screen and (min-width: 2500px) {
  .itemCard {
    width: 20% !important;
  }
}
@media only screen and (max-width: 1600px) {
  .itemCard {
    width: 50% !important;
  }
}
@media only screen and (max-width: 1050px) {
  .itemCard {
    width: 415px !important;
  }
}
@media only screen and (max-width: 900px) {
  .itemCard {
    width: 100% !important;
  }
}
</style>