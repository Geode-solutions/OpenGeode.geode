<template>
  <contextual-item v-bind="$attrs" toggle :toggle-init="toggle">
    <template #tooltip>
      Toggle Corners
    </template>

    <template #btn="{ btnStyle }">
      <logo-corners
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>
  </contextual-item>
</template>

<script>
import { mapState } from "vuex";
import LogoCorners from "@/assets/point_set.svg";
import ContextualItem from "@/components/ContextualItem";

export default {
  name: "ToggleCorners",
  components: {
    ContextualItem,
    LogoCorners
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
    this.toggle = this.item.style.corners.visible;
    this.$on("toggle-change", value => {
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["corners", "visible"],
        value
      });
      this.$store.commit("ui/setContextualItemVisibility", {
        name: "CornersSize",
        value
      });
      this.$store.commit("ui/setContextualItemVisibility", {
        name: "CornersColor",
        value
      });
      this.item.source.corners.forEach(source =>
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
