<template>
  <v-card flat tile class="grey lighten-5 overflow-y-auto mr-3">
    <v-row class="mx-0" style="width:100%">
      <v-col
        cols="4"
        v-for="(item, index) in addedItems"
        :key="index"
        class="pb-0"
        :class="[(index+1) % 1 == 0 ? 'pr-3 pl-0' : 'pr-3 pl-0']"
      >
        <v-card outlined class="orange lighten-4">
          <v-card-text
            style="text-transform: capitalize;"
            class="text-h5 pa-4"
            v-if="item.IS_PORTION === false"
          >{{item.NAME}} ({{item.QUANTITY*100}}g)</v-card-text>
          <v-card-text style="text-transform: capitalize;" class="text-h5" v-else>
            <div v-if="item.QUANTITY==1">{{item.NAME}} ({{item.QUANTITY}} portion)</div>
            <div v-else>{{item.NAME}} ({{item.QUANTITY}} portions)</div>
          </v-card-text>
          <app-nutrient-box :nutrientArray="item.CALCULATED_NUTRIENTS" type="box" class="mx-2"></app-nutrient-box>

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
            setDeleted(true)"
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
</template>

<script>
import nutrientBox from "./nutrientBox.vue";
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
    appNutrientBox: nutrientBox
  },
  data() {
    return {
      activeIndex: -1,
      savedCalories: 0,
      showDialogue: false,
      moduleIndex: 1,
      deleted: false
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
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapState("searchAndAdd", [
      "addedItems",
      "deleteFlag",
      "idx",
      "responseCount",
      "focus"
    ]),
    ...mapState("other", [
      "maintenanceCalories",
      "dailyEntries",
      "entryTodayExists",
      "entryTodayIndex"
    ]),
    ...mapState("firebase", [
      "password",
      "email",
      "loggedIn",
      "userData",
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
      "setDeleteFlag"
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
          if (this.$refs.inputAmount[0]) {
            this.$refs.inputAmount[0].focus();
          }
        }, 0);
      }
    },
    setDeleted(value) {
      this.deleted = value;
    }
  }
};
</script>

<style scoped>
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