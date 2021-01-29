<template>
  <v-card outlined class="mr-3 rounded-xl">
    <v-card-text class="text-h4 ma-2">Search for the food you want to add!</v-card-text>
    <v-row v-if="editIndex==-1" class="mx-2">
      <v-col cols="9">
        <v-text-field
          style="width: 100%"
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
      </v-col>
      <v-col cols="2" class="mx-auto">
        <v-btn
          style="width: 20vw"
          color="success"
          @click="
              allInOne();;
              "
        >
          <v-icon>mdi-magnify</v-icon>Search
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else class="mx-2">
      <v-col cols="9">
        <v-text-field
          style="width: 30vw"
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
      </v-col>
      <v-col cols="2" class="mx-auto">
        <v-btn
          style="width: 10vw"
          color="success"
          @click="
              searchRecipe();
              "
        >
          <v-icon>mdi-magnify</v-icon>Search
        </v-btn>
      </v-col>
    </v-row>
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
    ...mapState("searchAndAdd2", {recipeItems: "addedItems"}),
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
    ...mapActions("searchAndAdd2", {searchRecipe: "searchFood"}),
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
