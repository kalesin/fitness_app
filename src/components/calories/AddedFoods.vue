<template>
  <div class="mainFoods">
    <div class="addList col-sm-6 col-md-4">
      <div class="panel panel-success" v-for="(item, index) in addedItems" :key="index">
        <div class="panel-heading">
          <h3 v-if="item.IS_PORTION === false" class="panel-title" style="text-transform: capitalize;">{{item.NAME}} ({{item.QUANTITY*100}}g)</h3>
          <h3 v-else class="panel-title" style="text-transform: capitalize;">{{item.NAME}} ({{item.QUANTITY}} portions)</h3>
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
              @keyup.enter="onChanged({item, index})"
            />
            <div>✕ 100g</div>
            <button
              class="btn btn-success"
              @click="onChanged({item, index})"
              :disabled="parseFloat(item.CHANGED_QUANTITY)<=0 || item.CHANGED_QUANTITY === ''"
            >Change</button>
            <button class="btn btn-success" @click="onRemoved({index})">Remove</button>
          </div>
        </div>
      </div>
    </div>
    <div class="total">
      <div class="panel-heading">
        <h3 class="panel-title">Total today:</h3>
        <div class="pull-left">
            <input
              ref="inputAmount"
              type="number"
              class="form-control"
              placeholder="Enter maintenance calories"
              v-model="savedCalories"
            />
            <button
              class="btn btn-success"
              @click="setMaintenanceCalories(savedCalories)"
              :disabled="parseFloat(savedCalories)<=0"
            >Set</button>
          </div>
      </div>
      <div class="panel-body">
        <app-nutrient-box :nutrientArray="totalForToday" size="large" type="normal" total="daily"></app-nutrient-box>
      </div>
    </div>
  </div>
</template>

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

<script>
import nutrientBox from "./nutrientBox.vue";
import {mapGetters, mapState, mapActions} from 'vuex';

export default {
  components: {
    appNutrientBox: nutrientBox
  },
  data() {
    return {
      activeIndex: -1,
      quantity: "",
      savedCalories: 0,
    };
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapState("searchAndAdd", ["addedItems"]),
    ...mapState("other", ["maintenanceCalories"]),
    
  },
  methods: {
    ...mapActions("searchAndAdd", ["onChanged", "onRemoved"]),
    ...mapActions("other", ["setMaintenanceCalories"]),
    startEdit({ index }) {
      if ((this.activeIndex == index)) {
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