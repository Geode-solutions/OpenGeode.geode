<template>
  <contextual-item v-bind="$attrs">
    <template #tooltip>
      Clip
    </template>

    <template #btn>
      <v-icon>
        fas fa-expand
      </v-icon>
    </template>

    <template #option>
      <v-card>
        <v-card-text class="justify-center">
          <v-switch v-model="clip" label="Clip" />
          <v-switch v-model="display" label="Display" />
          <v-switch v-model="fixed" :disabled="!clip" label="Fixed" />
        </v-card-text>
      </v-card>
    </template>
  </contextual-item>
</template>

<script>
import ContextualItem from "@geode/geode-tools/src/components/ContextualItem";
import vtkImplicitPlaneWidget from "vtk.js/Sources/Widgets/Widgets3D/ImplicitPlaneWidget";
import vtkPlane from "vtk.js/Sources/Common/DataModel/Plane";

export default {
  name: "Clip",
  components: {
    ContextualItem
  },
  data: () => ({
    clip: false,
    display: true,
    fixed: false
  }),
  props: {
    item: Object,
    views: Array
  },
  watch: {
    clip: function(value) {
      this.views.forEach(v => {
        const widgetManager = v.getReferenceByName("widgetManager");
        v.getRepresentations().forEach(r => {
          if (r.getInput().getDataset() === this.item.vtk) {
            this.item.style.clipper.widget.placeWidget(
              this.item.vtk.getBounds()
            );
            this.item.style.clipper.widget.setPlaceFactor(3);
            this.item.style.clipper.widget.onWidgetChange(state => {
              const mapper = r.getMapper();
              mapper.removeAllClippingPlanes();
              if (!value) {
                mapper.addClippingPlane(
                  vtkPlane.newInstance({
                    origin: state.getOrigin(),
                    normal: state.getNormal()
                  })
                );
              }
              mapper.modified();
            });
            v.modified();
          }
        });
      });
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["clipper", "clip"],
        value
      });
    },
    display: function(value) {
      this.views.forEach(v => {
        const widgetManager = v.getReferenceByName("widgetManager");
        if (value) widgetManager.addWidget(this.item.style.clipper.widget);
        else widgetManager.removeWidget(this.item.style.clipper.widget);
        v.modified();
      });
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["clipper", "display"],
        value
      });
    },
    fixed: function(value) {
      this.views.forEach(v => {
        const widgetManager = v.getReferenceByName("widgetManager");
        if (value) widgetManager.disablePicking();
        else widgetManager.enablePicking();
      });
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["clipper", "fixed"],
        value
      });
    }
  },
  mounted() {
    this.clip = this.item.style.clipper.clip;
    this.display = this.item.style.clipper.display;
    this.fixed = this.item.style.clipper.fixed;
  }
};
</script>
