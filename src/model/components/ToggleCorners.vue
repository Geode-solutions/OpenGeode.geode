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
import LogoCorners from "../../assets/point_set.svg";
import ContextualItem from "@geode/geode-tools/src/components/ContextualItem";

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
  mounted() {
    this.toggle = this.item.style.corners.visible;
    this.$on("toggle-change", value => {
      this.$store.dispatch("model/style/setCornersVisibility", {
        id: this.item.id,
        value
      });
      this.$emit("update");
    });
  }
};
</script>
