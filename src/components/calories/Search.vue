<template>
  <v-card flat class="rounded-xl d-flex flex-column">
    <div v-if="editIndex==-1 && entryEditIndex==-1">
      <v-text-field
        dense
        clearable
        placeholder="Search for food you want to add!"
        ref="search"
        solo
        v-model="query"
        @keyup.enter="
                searchFood(moduleIndex);
                "
      ></v-text-field>
    </div>
    <div v-if="editIndex!=-1 && entryEditIndex==-1">
      <v-text-field
        dense
        clearable
        placeholder="Search for food you want to add to the recipe!"
        ref="search"
        solo
        v-model="query2"
        @keyup.enter="
                searchRecipe(moduleIndex);
                "
      ></v-text-field>
    </div>
    <div v-if="editIndex==-1 && entryEditIndex!=-1">
      <v-text-field
        dense
        clearable
        placeholder="Search for the food you want to add to this day!"
        ref="search"
        solo
        v-model="query3"
        @keyup.enter="
                searchEntry();
                "
      ></v-text-field>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  props: ["moduleIndex"],
  mounted() {
    this.$refs.search.focus();
  },
  computed: {
    ...mapState("searchAndAdd", ["addedItems", "itemsPropNames", "items"]),
    ...mapState("searchAndAdd2", { recipeItems: "addedItems" }),
    ...mapState("firebase", ["userID"]),
    ...mapState("other", ["editIndex", "entryEditIndex"]),
    query: {
      get() {
        return this.$store.state.searchAndAdd.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQuery", value);
      }
    },
    query2: {
      get() {
        return this.$store.state.searchAndAdd2.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd2/setQuery", value);
      }
    },
    query3: {
      get() {
        return this.$store.state.searchAndAdd3.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd3/setQuery", value);
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd", ["searchFood"]),
    ...mapActions("searchAndAdd2", { searchRecipe: "searchFood" }),
    ...mapActions("searchAndAdd3", { searchEntry: "searchFood" }),
   /*  updateAddedItems() {
      console.log(this.items);

      const data = {
        todaysAddedItems: this.addedItems
      };
      this.$http.patch("data/" + `${this.userID}` + ".json", data);

      const todaysItems = {
        breakfast: this.items[this.itemsPropNames[0]],
        lunch: this.items[this.itemsPropNames[1]],
        dinner: this.items[this.itemsPropNames[2]],
        snack: this.items[this.itemsPropNames[3]],
        unsorted: this.items[this.itemsPropNames[4]]
      };
      this.$http.patch(
        "data/" + `${this.userID}` + "/todaysItems.json",
        todaysItems
      );
    }, */
    allInOne() {
      this.searchFood(this.moduleIndex).then(this.updateAddedItems);
    }
  }
};
</script>
