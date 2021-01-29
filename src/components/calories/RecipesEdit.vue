<template>
  <v-card class="grey lighten-5 overflow-y-auto mr-3" tile flat>
    <v-row style="width: 100%;" class="mx-0">
      <v-col
        cols="4"
        v-for="(item, index) in addedItems"
        :key="index"
        class="pb-0"
        :class="[(index+1) % 1 == 0 ? 'pr-3 pl-0' : 'pr-3 pl-0']"
      >
        <v-card outlined class="yellow lighten-4">
          <v-card-text
            style="text-transform: capitalize;"
            class="text-h5 pa-4"
            v-if="item.IS_PORTION === false"
          >{{item.NAME}} ({{item.QUANTITY*100}}g)</v-card-text>
          <v-card-text
            style="text-transform: capitalize;"
            class="text-h5"
            v-else
          >{{item.NAME}} ({{item.QUANTITY}} portions)</v-card-text>
          <NutrientBox :nutrientArray="item.CALCULATED_NUTRIENTS" type="box" class="mx-2"></NutrientBox>

          <v-row style="width: 100%;" class="mx-0 pt-1">
            <v-col cols="2" class="pl-2 pt-1">
              <v-btn large icon @click="startEdit(index)">
                <v-icon v-if="activeIndex!==index">mdi-pencil-outline</v-icon>
                <v-icon v-else>mdi-pencil-off-outline</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="10">
              <v-card v-if="activeIndex == index" style="height: 44px;" class="mt-n2 rounded-lg">
                <v-row style="width: 100%;" class="mx-0">
                  <v-col cols="5" class="pt-1">
                    <v-text-field
                      dense
                      ref="inputAmount"
                      type="number"
                      step="0.5"
                      placeholder="x 100g"
                      v-model="quantity"
                      @blur="setFocus(false)"
                      @keyup.enter="
              onChanged({item, index, userID, moduleIndex, quantity})"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="pt-0">
                    <v-btn
                      icon
                      large
                      color="green"
                      @click="
              onChanged({item, index, userID, moduleIndex, quantity})"
                      :disabled="parseFloat(quantity)<=0 || quantity === ''"
                    >
                      <v-icon>mdi-check-bold</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="2" class="pt-0">
                    <v-btn icon large color="amber" @click="quantity=''">
                      <v-icon>mdi-close-thick</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="2" class="pt-0">
                    <v-btn
                      icon
                      large
                      color="red"
                      @click="
            onRemoved({index, userID, moduleIndex})
            startEdit(-1)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
  <!--  <div class="mainFoods">
    <div class="addList">
      <div class="panel panel-success" v-for="(item, index) in addedItems" :key="index">
        <div class="panel-heading">
          <h3
            v-if="item.IS_PORTION === false"
            class="panel-title"
            style="text-transform: capitalize;"
          >{{item.NAME}} ({{item.QUANTITY*100}}g)</h3>
          <h3
            v-else
            class="panel-title"
            style="text-transform: capitalize;"
          >{{item.NAME}} ({{item.QUANTITY}} portions)</h3>
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
            <button class="btn btn-success" @click="
            onRemoved({index, userID, moduleIndex})">Remove</button>
          </div>
        </div>
      </div>
    </div>
    <div class="total">
      <div class="panel-heading">
        <h3 class="panel-title">Total today:</h3>
        <div class="pull-left">
          <input
            type="number"
            class="form-control"
            placeholder="Enter maintenance calories"
            v-model="savedCalories"
          />
          <button
            class="btn btn-success"
            @click="
            setMaintenanceCalories({savedCalories, userID})"
            :disabled="parseFloat(savedCalories)<=0"
          >Set</button>

          <button
            v-if="entryTodayIndex==-1"
            class="btn btn-success"
            @click="
            addDailyEntry({today, addedItems, totalForToday, userID})"
            :disabled="isDisabled"
          >Save today</button>

          <v-btn
            v-else
            color="success"
            large
            @click.stop="showDialogue=true"
            :disabled="isDisabled"
          >Save today</v-btn>
          <app-entry-dialogue :visible="showDialogue" @close="showDialogue=false"></app-entry-dialogue>
        </div>
      </div>
      <div class="panel-body">
        <app-nutrient-box :nutrientArray="totalForToday" size="large" type="normal" total="daily"></app-nutrient-box>
      </div>
    </div>
  </div>-->
</template>

<script>
import NutrientBox from "./NutrientBox.vue";
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";

import EntryDialogue from "./EntryDialogue";

export default {
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
    ...mapGetters("searchAndAdd2", ["totalForToday"]),
    ...mapState("searchAndAdd2", [
      "addedItems",
      "idx",
      "responseCount",
      "focus"
    ]),
    ...mapState("other", [
      "dailyEntries",
      "entryTodayIndex",
    ]),
    ...mapState("firebase", [
      "userID"
    ]),
    today() {
      return dayjs().format("YYYY-MM-DD");
    },
    isDisabled() {
      let disabled = false;
      if (this.addedItems.length == 0) {
        disabled = true;
      }
      return disabled;
    },
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
</style>