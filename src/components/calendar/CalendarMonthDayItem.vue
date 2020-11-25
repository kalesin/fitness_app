<template>
  <li
    class="calendar-day progressBar"
    :class="{
      'calendar-day--not-current': !day.isCurrentMonth,
      'calendar-day--today': isToday
    }"
    @click="selectDate()"
  >
    <span>{{ label }}</span>

    <div v-if="day.entryExists" class="button-progressbar">
      <div :style="daily" class="progressBarBackground"></div>
      <div class="progressBarBackground2"></div>
      <div class="middiv"><div class="progressBarText">{{day.entry.total[0]}}/{{maintenanceCalories}}</div></div>
      <button class="btn btn-success">Edit</button>
    </div>
  </li>
</template>

<script>
import dayjs from "dayjs";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  
  name: "CalendarMonthDayItem",

  props: {
    day: {
      type: Object,
      required: true
    },

    isCurrentMonth: {
      type: Boolean,
      default: false
    },

    isToday: {
      type: Boolean,
      default: false 
    }
  },
  computed: {
    ...mapState("other", ["dailyEntries", "maintenanceCalories"]),
    label() {
      return dayjs(this.day.date).format("D");
    },
    daily() {
      return {
        width:
          this.maintenanceCalories && this.day.entry
            ? `${(this.day.entry.total[0] / this.maintenanceCalories) * 100}%`
            : "0%"
      };
    }
  },
  methods: {
    selectDate() {
      this.$emit("selectDate");
    }
  }
};
</script>

<style scoped>
.middiv{
  position: absolute;
  height: 30px;
  bottom: 0;
  z-index: 0;
  width: 100%;
  height: 75%;
  display: flex;
}
.btn {
  height: 25%;
  width: 70%;
  position: absolute;
  top: 0;
  font-size: 10px;
  left: 20px;
}
.button-progressbar {
  z-index: 2;
  align-self: center;
  width: 100%;
}
span {
  z-index: 1;
}

.progressBarBackground {
  position: absolute;
  background-color: greenyellow;
  height: 30px;
  bottom: 0;
  z-index: -1;
  max-width: 100%;
  height: 75%;
  display: flex;
}
.progressBarBackground2 {
  position: absolute;
  background-color: rgb(255, 47, 47);
  height: 30px;
  bottom: 0;
  z-index: -2;
  width: 100%;
  height: 75%;
  display: flex;
}
.progressBarText {
  align-self: center;
  z-index: 2;
  width: 100%;
}
.progressBar {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  position: relative;
}
.calendar-day {
  display: flex;
  position: relative;
  min-height: 100px;
  font-size: 16px;
  background-color: #fff;
  color: var(--grey-800);
  padding: 0 0 5px;
}

.calendar-day > span {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 2px;
  width: var(--day-label-size);
  height: var(--day-label-size);
}

.calendar-day--not-current {
  background-color: var(--grey-100);
  color: var(--grey-300);
}

.calendar-day--today {
  padding-top: 4px;
  font-size: 20px;
  font-weight: 900;
  border: 2px solid orangered;
}
</style>
