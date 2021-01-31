<template>
  <v-card outlined class="rounded-xl d-flex flex-column">
    <div v-if="editIndex==-1">
      <v-card-text class="text-h4">Add food to your eaten items!</v-card-text>
      <div class="mx-2 flex-grow-1 d-flex align-center">
        <v-text-field
          class="mr-8 mt-6"
          dense
          clearable
          placeholder="Search foods"
          ref="search"
          solo
          v-model="query"
          @keyup.enter="
                allInOne();;
                "
        ></v-text-field>
        <v-btn color="success" @click="
              allInOne();;
              ">
          <v-icon>mdi-magnify</v-icon>Search
        </v-btn>
      </div>
    </div>
    <div v-else>
      <v-card-text class="text-h4">Add food to the recipe!</v-card-text>
      <div class="mx-2 flex-grow-1 d-flex align-center">
        <v-text-field
          class="mr-8 mt-6"
          dense
          clearable
          placeholder="Search foods"
          ref="search"
          solo
          v-model="query2"
          @keyup.enter="
                searchRecipe();
                "
        ></v-text-field>
        <v-btn color="success" @click="
              searchRecipe();
              ">
          <v-icon>mdi-magnify</v-icon>Search
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  mounted() {
    this.$refs.search.focus();
  },
  computed: {
    ...mapState("searchAndAdd", ["addedItems"]),
    ...mapState("searchAndAdd2", { recipeItems: "addedItems" }),
    ...mapState("firebase", ["userID"]),
    ...mapState("other", ["editIndex"]),
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
    }
  },
  methods: {
    ...mapActions("searchAndAdd", ["searchFood"]),
    ...mapActions("searchAndAdd2", { searchRecipe: "searchFood" }),
    updateAddedItems() {
      const data = {
        todaysItems: this.$store.state.searchAndAdd.addedItems
      };
      console.log(data);
      this.$http.patch("data/" + `${this.userID}` + ".json", data);
    },
    allInOne() {
      this.searchFood().then(this.updateAddedItems);
    }
  }
};
</script>
