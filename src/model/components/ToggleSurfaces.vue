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
import { mapState } from "vuex";
import LogoSurfaces from "@/assets/surface.svg";
import ContextualItem from "@/components/ContextualItem";

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
  computed: {
    ...mapState(["proxyManager"])
  },
  mounted() {
    this.toggle = this.item.style.surfaces.visible;
    this.$on("toggle-change", value => {
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["surfaces", "visible"],
        value
      });
      this.$store.commit("ui/setContextualItemVisibility", {
        name: "SurfacesMesh",
        value
      });
      this.$store.commit("ui/setContextualItemVisibility", {
        name: "SurfacesColor",
        value
      });
      this.item.source.surfaces.forEach(source =>
        this.proxyManager
          .getRepresentations()
          .filter(r => r.getInput() === source)
          .forEach(r => r.setVisibility(value))
      );
      this.$emit("update");
    });
  }
};
</script>
