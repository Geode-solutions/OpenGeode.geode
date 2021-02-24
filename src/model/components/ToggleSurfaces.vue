<template>
  <contextual-item v-bind="$attrs" toggle :toggle-init="toggle">
    <template #tooltip>
      Toggle Surfaces
    </template>

    <template #btn="{ btnStyle }">
      <logo-surfaces
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>
  </contextual-item>
</template>

<script>
import LogoSurfaces from "../../assets/surface.svg";
import ContextualItem from "@geode/geode-tools/src/components/ContextualItem";

export default {
  name: "ToggleSurfaces",
  components: {
    ContextualItem,
    LogoSurfaces
  },
  data: () => ({
    toggle: false
  }),
  props: {
    item: Object
  },
  mounted() {
    this.toggle = this.item.style.surfaces.visible;
    console.log("this.toggle", this.toggle);
    this.$on("toggle-change", value => {
      console.log("value", value);
      this.$store.dispatch("model/style/setSurfacesVisibility", {
        id: this.item.id,
        value
      });
      this.$emit("update");
    });
  }
};
</script>
