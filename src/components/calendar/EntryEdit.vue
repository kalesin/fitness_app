<template>
    <v-card
      flat
      tile
      class="light-green lighten-3 overflow-y-auto d-flex flex-wrap align-content-start rounded-lg pl-2"
    >
      <div v-for="(item, index) in addedItems" :key="index" class="itemCard pa-2 pb-0 pl-0">
        <v-card outlined class="lime accent-1 rounded-lg">
          <div class="d-flex">
            <v-card-text
              style="text-transform: capitalize; width: 65%; text-align: center; line-height: 100px; height: 100px"
              class="text-h5 pa-0 justify-end align-end"
            >{{item.NAME}}</v-card-text>
            <div class="d-flex flex-column pt-2 pr-2" style="width: 35%">
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
            onRemoved({index, userID, moduleIndex})
            setDeleted(true)"
                >
                  <v-icon class="mr-2">mdi-delete</v-icon>
                </v-btn>
              </div>
              <div style="height: 50px">
                <div v-if="item.IS_PORTION === false">
                  <v-card-text
                    @click="startEdit(index)"
                    v-if="activeIndex!==index"
                    style="padding-top: 10px; font: inherit; font-size:16px; padding-left: 48px; font-weight: 400; letter-spacing: 0em"
                  >x {{item.QUANTITY*100}}g</v-card-text>
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
                      :placeholder="`x ${item.QUANTITY*100}g`"
                      v-model="quantity"
                      @blur="setFocus(false)"
                      @keyup.enter="
              onChanged({item, index, userID, moduleIndex, quantity})
              resetEdit()"
                    ></v-text-field>
                  </div>
                </div>
                <div v-else>
                  <v-card-text
                    @click="startEdit(index)"
                    v-if="activeIndex!==index"
                    style="padding-top: 10px; font: inherit; font-size:16px; padding-left: 48px; font-weight: 400; letter-spacing: 0em"
                  >
                    <div v-if="item.QUANTITY==1">x 1 por.</div>
                    <div v-else>x {{item.QUANTITY}} por.</div>
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
                      :placeholder="`x ${item.QUANTITY} por.`"
                      v-model="quantity"
                      @blur="setFocus(false)"
                      @keyup.enter="
              onChanged({item, index, userID, moduleIndex, quantity})
              resetEdit()"
                    ></v-text-field>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <NutrientBox :nutrientArray="item.CALCULATED_NUTRIENTS" class="ma-2 mt-0"></NutrientBox>
        </v-card>
      </div>
    </v-card>
</template>

<script>
import NutrientBox from "../calories/NutrientBox.vue";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  mounted() {
    if (this.entryEditIndex != -2) {
      this.setAddedItems(this.dailyEntries[this.entryEditIndex].items);
    } else {
      this.setAddedItems([]);
    }
  },
  components: {
    NutrientBox
  },
  data() {
    return {
      activeIndex: -1,
      moduleIndex: 4
    };
  },
  watch: {
    addedItems: {
      handler() {
        if (this.deleted) {
          this.activeIndex = -1;
          this.setDeleted(false);
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
    ...mapGetters("searchAndAdd3", ["totalForToday"]),
    ...mapState("searchAndAdd3", [
      "addedItems",
      "idx",
      "responseCount",
      "focus"
    ]),
    ...mapState("other", ["dailyEntries", "entryTodayIndex", "entryEditIndex"]),
    ...mapState("firebase", ["userID"]),
    quantity: {
      get() {
        return this.$store.state.searchAndAdd3.quantity;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd3/setQuantity", value);
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd3", [
      "onChanged",
      "onRemoved",
      "setFocus",
      "setAddedItems"
    ]),
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
.itemCard {
  width: calc(100% / 3);
}
@media only screen and (max-width: 1000px) {
  .itemCard {
    width: 50% !important;
  }
}
</style>
