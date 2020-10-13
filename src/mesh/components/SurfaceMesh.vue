<template>
  <contextual-item v-bind="$attrs" toggle :toggle-init="toggle">
    <template #tooltip>
      Toggle mesh
    </template>

    <template #btn="{ btnStyle }">
      <logo-mesh :style="{ height: btnStyle.height, width: btnStyle.width }" />
    </template>
  </contextual-item>
</template>

<script>
import { mapActions, mapState } from "vuex";
import LogoMesh from "../../assets/triangulated_surface.svg";
import ContextualItem from "@geode/geode-tools/src/components/ContextualItem";

export default {
  name: "SurfaceMesh",
  components: {
    ContextualItem,
    LogoMesh
  },
  data: () => ({
    toggle: false
  }),
  props: {
    item: Object
  },
  mounted() {
    this.toggle = this.item.style.mesh.visible;
    this.$on("toggle-change", value => {
      this.$store.dispatch("mesh/style/setEdgeVisibility", {
        id: this.item.id,
        value
      });
    });
  }
};
</script>
