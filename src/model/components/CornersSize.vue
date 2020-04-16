<template>
  <contextual-item v-bind="$attrs">
    <template #tooltip>
      Corners size
    </template>

    <template #btn="{ btnStyle }">
      <logo-corners-size
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>

    <template #option>
      <v-card width="200">
        <v-slider
          v-model="size"
          hide-details
          min="0"
          max="20"
          step="2"
          thumb-label
          thumb-color="black"
          ticks
        ></v-slider>
      </v-card>
    </template>
  </contextual-item>
</template>

<script>
import LogoCornersSize from "@/assets/point_set_size.svg";
import ContextualItem from "@/components/ContextualItem";

export default {
  name: "CornersSize",
  components: {
    ContextualItem,
    LogoCornersSize
  },
  data: () => ({
    size: 0
  }),
  props: {
    item: Object
  },
  watch: {
    size: function(value) {
      this.$store.dispatch("model/style/setCornersSize", {
        id: this.item.id,
        value
      });
    }
  },
  mounted() {
    this.size = this.item.style.corners.size;
  }
};
</script>
