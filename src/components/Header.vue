<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <router-link to="/" class="navbar-brand">Fitness App</router-link>
      </div>

      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          
          <router-link to="/calories" activeClass="active" tag="li">
            <a>Calories</a>
          </router-link>
          <router-link to="/recipes" activeClass="active" tag="li">
            <a>My Recipes</a>
          </router-link>
        </ul>
        <strong class="navbar-text navbar-right">Funds: {{}}</strong>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="#" >End Day</a>
          </li>
          <li
            class="dropdown"
            :class="{open: isDropdownOpen}"
            @click="isDropdownOpen = !isDropdownOpen"
          >
            <a
              href="#"
              class="dropdown-toggle"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Save & Load
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a href="#" >Save Data</a>
              </li>
              <li>
                <a href="#" >Load Data</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  data() {
    return {
      isDropdownOpen: false
    };
  },
  computed: {
  },
  methods: {
  }
};
</script>