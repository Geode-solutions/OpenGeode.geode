<template>
  <contextual-item v-bind="$attrs">
    <template #tooltip>
      Surfaces color
    </template>

    <template #btn="{ btnStyle }">
      <logo-surfaces-color
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
import { mapState } from "vuex";
import LogoSurfacesColor from "@/assets/surface_color.svg";
import ContextualItem from "@/components/ContextualItem";

export default {
  name: "SurfacesColor",
  components: {
    ContextualItem,
    LogoSurfacesColor
  },
  data: () => ({
    color: { r: 0, g: 0, b: 0 }
  }),
  props: {
    item: Object
  },
  computed: {
    ...mapState(["proxyManager"])
  },
  watch: {
    color: function(value) {
      const newColor = [value.r / 255, value.g / 255, value.b / 255];
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["surfaces", "color"],
        value: newColor
      });
      this.item.source.surfaces.forEach(source =>
        this.proxyManager
          .getRepresentations()
          .filter(r => r.getInput() === source)
          .forEach(r => r.setColor(newColor))
      );
    }
  },
  mounted() {
    const color = this.item.style.surfaces.color;
    this.color = {
      r: color[0] * 255,
      g: color[1] * 255,
      b: color[2] * 255
    };
  }
};
</script>
