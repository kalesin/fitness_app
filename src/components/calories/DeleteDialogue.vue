<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <p
        style="padding:10px; font-size:20px;"
      >Clicking will permanently delete the selected recipe. Want to delete recipe?</p>
 
      <v-card-actions>
        <v-btn
          color="success"
          @click.stop="
      removeRecipe({editIndex: index, userID})
      show=false
      "
        >Yes, Delete</v-btn>
        <v-btn color="error" @click.stop="show=false">No, Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  props: ["visible"],
  computed: {
    ...mapState("searchAndAdd", ["addedItems"]),
    ...mapState("firebase", ["userID"]),
    ...mapState("other", ["editIndex"]),
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    },
  },
  methods: {
    ...mapActions("other", ["removeRecipe"])
  }
};
</script>

<style scoped>
.v-card__actions {
  justify-content: space-around;
  padding: 15px;
}
</style>