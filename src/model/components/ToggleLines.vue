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
import { mapState } from "vuex";
import LogoLines from "@/assets/edged_curve.svg";
import ContextualItem from "@/components/ContextualItem";

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
  computed: {
    ...mapState(["proxyManager"])
  },
  mounted() {
    this.toggle = this.item.style.lines.visible;
    this.$on("toggle-change", value => {
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["lines", "visible"],
        value
      });
      this.$store.commit("ui/setContextualItemVisibility", {
        name: "LinesColor",
        value
      });
      this.item.source.lines.forEach(source =>
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
