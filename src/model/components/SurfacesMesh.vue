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
import { mapState } from "vuex";
import LogoSurfacesMesh from "@/assets/triangulated_surface.svg";
import ContextualItem from "@/components/ContextualItem";

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
  computed: {
    ...mapState(["proxyManager"])
  },
  mounted() {
    this.toggle = this.item.style.surfaces.mesh.visible;
    this.$on("toggle-change", value => {
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["surfaces", "mesh", "visible"],
        value
      });
      let rep = value ? "Surface with edges" : "Surface";
      this.item.source.surfaces.forEach(source =>
        this.proxyManager
          .getRepresentations()
          .filter(r => r.getInput() === source)
          .forEach(r => r.setRepresentation(rep))
      );
    });
  }
};
</script>
