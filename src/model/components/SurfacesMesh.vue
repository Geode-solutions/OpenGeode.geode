<template>
  <contextual-item v-bind="$attrs" toggle :toggle-init="toggle">
    <template #tooltip>
      Toggle Surfaces mesh
    </template>

    <template #btn="{ btnStyle }">
      <logo-surfaces-mesh
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>
  </contextual-item>
</template>

<script>
import LogoSurfacesMesh from "../../assets/triangulated_surface.svg";
import ContextualItem from "@geode/geode-tools/src/components/ContextualItem";

export default {
  name: "SurfacesMesh",
  components: {
    ContextualItem,
    LogoSurfacesMesh
  },
  data: () => ({
    toggle: false
  }),
  props: {
    item: Object
  },
  mounted() {
    this.toggle = this.item.style.surfaces.mesh.visible;
    this.$on("toggle-change", value => {
      this.$store.dispatch("model/style/setSurfacesMeshVisibility", {
        id: this.item.id,
        value
      });
    });
  }
};
</script>
