<template>
  <v-card flat tile class="light-green lighten-3 overflow-y-auto d-flex flex-wrap align-content-start rounded-lg pl-2">
    <div
      v-for="(item, index) in addedItems"
      :key="index"
      class="itemCard pa-2 pb-0 pl-0"
    >
      <v-card outlined class="lime accent-1 rounded-lg">
        <div class="d-flex">
          <v-card-text
            style="text-transform: capitalize; text-align: center; line-height: 100px; height: 100px"
            class="text-h5 pa-0 justify-end align-end flex-grow-1 textWidth"
          >{{item.NAME}}</v-card-text>
          <div class="d-flex flex-column pt-2 pr-2" style="width: 125px">
            <div class="d-flex justify-end pr-0">
              <v-btn class="justify-end" large icon @click="startEdit(index)">
                <v-icon v-if="activeIndex!==index" class="mr-2">mdi-pencil-outline</v-icon>
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
              <div>
                <v-card-text
                  @click="startEdit(index)"
                  v-if="activeIndex!==index"
                  style="padding-top: 10px; font: inherit; font-size:16px; padding-left: 48px; font-weight: 400; letter-spacing: 0em"
                >x {{item.QUANTITY}}g</v-card-text>
                <div v-else class="d-flex justify-space-around"
                  >
                  <v-btn
                    class="mr-1"
                    icon
                    large
                    color="green"
                    @click="
              onChanged({item, index, userID, moduleIndex, quantity})
              setFocus(false)"
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
                    :placeholder="`x ${item.QUANTITY}g`"
                    v-model="quantity"
                    @blur="setFocus(false)"
                    @keyup.enter="
              onChanged({item, index, userID, moduleIndex, quantity})
              setFocus(false)"
                  ></v-text-field>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NutrientBox :nutrientArray="item.CALCULATED_NUTRIENTS" type="box" class="ma-2 mt-0"></NutrientBox>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import NutrientBox from "./NutrientBox.vue";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  props: ["moduleIndex"],
  components: {
    NutrientBox
  },
  data() {
    return {
      activeIndex: -1
    };
  },
  watch: {
    addedItems: {
      handler() {
        if (!this.focus) {
          this.activeIndex = -1;
        } else {
          this.startEdit(this.addedItems.length - 1);
        }
        for (let i = 0; i < this.dailyEntries.length; i++) {
          if (this.dailyEntries[i].date === this.today) {
            this.setEntryTodayIndex(i);
          }
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
  computed: {
    ...mapGetters("searchAndAdd2", ["totalForToday"]),
    ...mapState("searchAndAdd2", [
      "addedItems",
      "idx",
      "responseCount",
      "focus"
    ]),
    ...mapState("other", ["dailyEntries", "entryTodayIndex"]),
    ...mapState("firebase", ["userID"]),
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
    ...mapActions("searchAndAdd2", ["onChanged", "onRemoved", "setFocus"]),
    ...mapActions("other", [
      "setMaintenanceCalories",
      "addDailyEntry",
      "setEntryTodayIndex"
    ]),
    startEdit(index) {
      if (this.activeIndex == index && !this.focus) {
        this.activeIndex = -1;
      } else {
        this.quantity = "";
        this.activeIndex = index;
        setTimeout(() => {
          if (this.$refs.inputAmount) {
            this.$refs.inputAmount[0].focus();
          }
        }, 0);
      }
    }
  }
};
</script>

<style scoped>
.textWidth {
  width: calc(100% - 125px);
}
.itemCard {
  width: calc(100%/3);
}
@media only screen and (max-width: 1200px) {
  .itemCard {
    width: 50% !important;
  }
}
@media only screen and (max-width: 800px) {
  .itemCard {
    width: 100% !important;
  }
}
</style>