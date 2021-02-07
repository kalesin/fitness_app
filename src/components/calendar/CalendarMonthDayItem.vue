<template>
  <li
    class="calendar-day"
    :class="{
      'calendar-day--not-current': !day.isCurrentMonth,
      'calendar-day--today': isToday
    }"
    @click="selectDate(day)"
  >
    <span class="ma-1">{{ label }}</span>
    <div v-if="day.entryExists" style="height: 100%; width: 100%" class="d-flex yellow lighten-4">
      <v-card-text
        class="d-flex pa-4 align-center text-h5 font-weight-bold" style="width: 50%"
      >{{this.day.entry.total[0]}} kcal</v-card-text>
      <v-progress-circular
      class="d-flex my-auto"
        :size="100"
        :width="20"
        :rotate="90"
        :value="dailyProgress"
        color="green"
      >{{ Math.round(dailyProgress) }} %</v-progress-circular>
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
    dailyProgress: {
      get() {
        return (this.day.entry.total[0] / this.maintenanceCalories) * 100;
      },
      set(value) {}
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
    ...mapActions("other", ["setEditDate"]),
    selectDate(day) {
      this.setEditDate(day.date)
      this.$emit("selectDate");
    }
  }
};
</script>

<style scoped>
.middiv {
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

.calendar-day {
  display: flex;
  position: relative;
  height: 124px;
  font-size: 16px;
  background-color: #fff;
  color: var(--grey-800);
  padding: 0 0;
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
