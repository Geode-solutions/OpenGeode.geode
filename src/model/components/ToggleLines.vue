<template>
  <contextual-item v-bind="$attrs" toggle :toggle-init="toggle">
    <template #tooltip>
      Toggle Lines
    </template>

    <template #btn="{ btnStyle }">
      <logo-lines :style="{ height: btnStyle.height, width: btnStyle.width }" />
    </template>
  </contextual-item>
</template>

<script>
import LogoLines from "../../assets/edged_curve.svg";
import ContextualItem from "@geode/geode-tools/src/components/ContextualItem";

export default {
  name: "ToggleLines",
  components: {
    ContextualItem,
    LogoLines
  },
  data: () => ({
    toggle: false
  }),
  props: {
    item: Object
  },
  mounted() {
    this.toggle = this.item.style.lines.visible;
    this.$on("toggle-change", value => {
      this.$store.dispatch("model/style/setLinesVisibility", {
        id: this.item.id,
        value
      });
      this.$emit("update");
    });
  }
};
</script>
