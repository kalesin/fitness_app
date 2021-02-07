<template>
  <v-dialog v-model="show" width="90%">
    <v-card class="pa-3">
      <div class="d-flex mb-3" style="height: 240px;">
        <Search class="mr-3" style="height: 240px; width: 50vw"></Search>

        <EntryBox :nutrientArray="totalEntry" style="height: 240px; width: 50vw">
          <v-btn
            class="totalButtons mb-2"
            width="52"
            height="52"
            icon
            color="error"
            @click.stop="show=false"
          >
            <v-icon x-large>mdi-close-circle</v-icon>
          </v-btn>
        </EntryBox>
      </div>
      <div class="d-flex recipesEdit">
        <EntryEdit class="flex-grow-1"></EntryEdit>
      </div>
    </v-card>
    <v-snackbar absolute top rounded="pill" shaped v-model="snackbar">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import EntryBox from "../calories/EntryBox";
import EntryEdit from "./EntryEdit";

import Search from "../calories/Search";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  mounted() {
    
  },
  data() {
    return {
      snackbar: false,
      text: `Can't submit a recipe with no items, add some items!`
    };
  },
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  components: {
    EntryBox,
    EntryEdit,
    Search
  },
  computed: {
    ...mapState("firebase", ["userID"]),
    ...mapState("searchAndAdd3", { addedEntry: "addedItems" }),
    ...mapGetters("searchAndAdd3", { totalEntry: "totalForToday" }),
    show: {
      get() {
        return this.index != -1;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    },
  },
  methods: {
      
  }
};
</script>

<style scoped>
.v-card__actions {
  justify-content: space-around;
  padding: 15px;
}
.recipesEdit {
  height: calc(90vh - 240px - 3 * 12px);
}

@media only screen and (max-width: 1000px) {
  .totalButtons {
    width: 40px !important;
  }
}
</style>