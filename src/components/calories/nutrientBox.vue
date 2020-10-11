<template>
  <div :class="{small: size === 'small', large: size ==='large'}">
    <div v-if="size === 'large'" class="energyBox">
      {{nutrientArray[0]}} kcal
      <hr />
    </div>
    <div class="nutrientBox">
      <div v-if="size === 'small'" class="nutrientSubBox">
        <div class="nutrientType"></div>
        {{nutrientArray[0]}} kcal
      </div>
      <div class="nutrientSubBox">
        <div class="nutrientType">Protein:</div>
        {{nutrientArray[1]}} g
      </div>
      <div class="nutrientSubBox">
        <div class="nutrientType">Carbs:</div>
        {{nutrientArray[2]}} g
      </div>
      <div class="nutrientSubBox">
        <div class="nutrientType">Fats:</div>
        {{nutrientArray[3]}} g
      </div>
      <div class="nutrientSubBox">
        <div class="nutrientType">Fiber:</div>

        {{nutrientArray[4]}} g
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["nutrientArray", "size"]
};
</script>

<style scoped>
.nutrientType {
  display: inline-block;
}
.nutrientBox {
  display: flex;
}
.nutrientSubBox {
  margin-right: 10px;
  width: 25%;
  border: 1px solid gray;
  text-align: center;
  padding: 10px;
}
.energyBox {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}
.large {
}
.small {

}
</style>
