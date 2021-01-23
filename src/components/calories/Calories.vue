<template>
  <v-container fluid class="grey lighten-5 ma-0 pa-3">
    <v-row style="width: 100%;" class="mx-0">
      <v-col cols="9" class="pr-0 pa-0">
        <v-card outlined class="mr-3 rounded-xl">
          <v-card-text class="text-h4 ma-2">Search for the food you want to add!</v-card-text>
          <v-row class="mx-2" v-if="editIndex==-1">
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
                style="width: 190px"
                color="success"
                @click="
              allInOne();;
              "
              >
                <v-icon>mdi-magnify</v-icon>Search
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="mx-2" v-else>
            <v-col cols="9">
              <v-text-field
                style="width: 100%"
                dense
                clearable
                placeholder="Search foods"
                ref="search"
                solo
                v-model="query4"
                @keyup.enter="
                searchRecipe();;
                "
              ></v-text-field>
            </v-col>
            <v-col cols="2" class="mx-auto">
              <v-btn
                style="width: 190px"
                color="success"
                @click="
              searchRecipe();;
              "
              >
                <v-icon>mdi-magnify</v-icon>Search
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <app-added-foods v-if="editIndex==-1"></app-added-foods>
        <app-recipes-edit v-else></app-recipes-edit>
      </v-col>

      <v-col cols="3" class="pa-0">
        <app-recipes-display></app-recipes-display>
        <app-nutrient-box v-if="editIndex==-1" :nutrientArray="totalForToday" type="daily"></app-nutrient-box>
        <app-nutrient-box v-else :nutrientArray="totalRecipe" type="recipe"></app-nutrient-box>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>

<script>
import AddedFoods from "./AddedFoods";
import RecipesDisplay from "./RecipesDisplay";
import RecipesEdit from "./RecipesEdit";
import nutrientBox from "./nutrientBox.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  mounted() {
    this.$refs.search.focus();
  },
  components: {
    appAddedFoods: AddedFoods,
    appRecipesDisplay: RecipesDisplay,
    appNutrientBox: nutrientBox,
    appRecipesEdit: RecipesEdit
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapState("searchAndAdd", ["addedItems"]),

    ...mapGetters("searchAndAdd4", { totalRecipe: "totalForToday" }),
    ...mapState("searchAndAdd4", ["addedItems"]),

    ...mapState("other", ["editIndex"]),
    ...mapState("firebase", ["userID"]),
    query: {
      get() {
        return this.$store.state.searchAndAdd.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQuery", value);
      }
    },
    query4: {
      get() {
        return this.$store.state.searchAndAdd4.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd4/setQuery", value);
      }
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
    ...mapActions("searchAndAdd", ["searchFood"]),
    ...mapActions("searchAndAdd4", { searchRecipe: "searchFood" }),
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