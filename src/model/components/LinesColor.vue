<template>
  <contextual-item v-bind="$attrs">
    <template #tooltip> Lines color </template>

    <template #btn="{ btnStyle }">
      <logo-lines-color
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>

    <template #option>
      <v-color-picker
        ref="action"
        v-model="color"
        canvas-height="100"
        hide-inputs
        width="200"
      ></v-color-picker>
    </template>
  </contextual-item>
</template>

<script>
import LogoLinesColor from "../../assets/edged_curve_color.svg";
import ContextualItem from "@geode/geode-tools/src/components/ContextualItem";

export default {
  name: "LinesColor",
  components: {
    ContextualItem,
    LogoLinesColor,
  },
  data: () => ({
    color: { r: 0, g: 0, b: 0 },
  }),
  props: {
    item: Object,
  },
  watch: {
    color: function (value) {
      const newColor = [value.r / 255, value.g / 255, value.b / 255];
      this.$store.dispatch("model/style/setLinesColor", {
        id: this.item.id,
        value: newColor,
      });
    },
  },
  mounted() {
    const color = this.item.style.lines.color;
    this.color = {
      r: color[0] * 255,
      g: color[1] * 255,
      b: color[2] * 255,
    };
  },
};
</script>
