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
import { mapState } from "vuex";
import LogoMesh from "@/assets/triangulated_surface.svg";
import ContextualItem from "@/components/ContextualItem";

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
  computed: {
    ...mapState(["proxyManager"])
  },
  mounted() {
    this.toggle = this.item.style.mesh.visible;
    this.$on("toggle-change", value => {
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["mesh", "visible"],
        value
      });
      let rep = value ? "Surface with edges" : "Surface";
      this.proxyManager
        .getRepresentations()
        .filter(r => r.getInput() === this.item.source)
        .forEach(r => r.setRepresentation(rep));
    });
  }
};
</script>
