<template>
  <contextual-item v-bind="$attrs">
    <template #tooltip>
      Color
    </template>

    <template #btn="{ btnStyle }">
      <logo-surface-color
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>

    <template #option>
      <v-card>
        <v-card-text class="justify-center">
          <v-combobox
            v-model="select"
            :items="styles"
            label="Select color style"
          ></v-combobox>
          <v-color-picker
            v-if="select === 'Constant'"
            ref="action"
            v-model="color"
            flat
            canvas-height="100"
            hide-inputs
            width="200"
          ></v-color-picker>
          <v-combobox
            v-model="vertexAttributeName"
            v-if="select === 'From vertex attribute'"
            :items="vertexAttributes"
            label="Select attribute"
          ></v-combobox>
          <v-combobox
            v-model="polygonAttributeName"
            v-if="select === 'From polygon attribute'"
            :items="polygonAttributes"
            label="Select attribute"
          ></v-combobox>
        </v-card-text>
      </v-card>
    </template>
  </contextual-item>
</template>

<script>
import { mapState } from "vuex";
import LogoSurfaceColor from "@/assets/surface_color.svg";
import ContextualItem from "@/components/ContextualItem";
import vtkDataArray from "vtk.js/Sources/Common/Core/DataArray";

export default {
  name: "SurfacesColor",
  components: {
    ContextualItem,
    LogoSurfaceColor
  },
  data: () => ({
    color: { r: 0, g: 0, b: 0 },
    select: "Constant",
    styles: ["Constant", "From vertex attribute", "From polygon attribute"],
    vertexAttributeName: "",
    polygonAttributeName: ""
  }),
  props: {
    item: Object
  },
  computed: {
    ...mapState(["proxyManager"]),
    vertexAttributes() {
      const manager = this.item.cpp.vertex_attribute_manager();
      return manager
        .attribute_names()
        .filter(name => manager[manager.attribute_type(name)]);
    },
    polygonAttributes() {
      const manager = this.item.cpp.polygon_attribute_manager();
      return manager
        .attribute_names()
        .filter(name => manager[manager.attribute_type(name)]);
    }
  },
  watch: {
    color: function(value) {
      const newColor = [value.r / 255, value.g / 255, value.b / 255];
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["color"],
        value: newColor
      });
      this.proxyManager
        .getRepresentations()
        .filter(r => r.getInput() === this.item.source)
        .forEach(r => r.setColor(newColor));
    },
    vertexAttributeName: function(value) {
      if (!value) return;
      const manager = this.item.cpp.vertex_attribute_manager();
      if (!manager.attribute_exists(value)) {
        return;
      }
      const scalars = new Float32Array(this.item.cpp.nb_vertices());
      const attribute = manager[manager.attribute_type(value)](value);
      for (let i = 0; i < manager.nb_elements(); i++) {
        const att_value = attribute.value(i);
        if (att_value != 4294967295) scalars[i] = att_value;
        else scalars[i] = NaN;
      }
      const data = vtkDataArray.newInstance({
        name: value,
        numberOfComponents: 1,
        values: scalars
      });
      this.item.vtk.getPointData().addArray(data);
      this.proxyManager
        .getRepresentations()
        .filter(r => r.getInput() === this.item.source)
        .forEach(r => r.setColorBy(value, "pointData"));
    },
    polygonAttributeName: function(value) {
      if (!value) return;
      const manager = this.item.cpp.polygon_attribute_manager();
      if (!manager.attribute_exists(value)) {
        return;
      }
      const scalars = new Float32Array(
        this.item.cpp.nb_vertices() + this.item.cpp.nb_polygons()
      );
      const attribute = manager[manager.attribute_type(value)](value);
      for (let i = 0; i < manager.nb_elements(); i++) {
        const att_value = attribute.value(i);
        if (att_value != 4294967295)
          scalars[this.item.cpp.nb_vertices() + i] = att_value;
        else scalars[this.item.cpp.nb_vertices() + i] = NaN;
      }
      const data = vtkDataArray.newInstance({
        name: value,
        numberOfComponents: 1,
        values: scalars
      });
      this.item.vtk.getCellData().addArray(data);
      this.proxyManager
        .getRepresentations()
        .filter(r => r.getInput() === this.item.source)
        .forEach(r => r.setColorBy(value, "cellData"));
    }
  },
  mounted() {
    const color = this.item.style.color;
    this.color = {
      r: color[0] * 255,
      g: color[1] * 255,
      b: color[2] * 255
    };
  }
};
</script>
