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
import { mapActions } from "vuex";
import LogoSurfaceColor from "@/assets/surface_color.svg";
import ContextualItem from "@/components/ContextualItem";

export default {
  name: "SurfacesColor",
  components: {
    ContextualItem,
    LogoSurfaceColor
  },
  data: () => ({
    color: { r: 0, g: 0, b: 0 },
    select: "",
    styles: ["Constant", "From vertex attribute", "From polygon attribute"],
    vertexAttributeName: "",
    polygonAttributeName: "",
    vertexAttributes: [],
    polygonAttributes: []
  }),
  props: {
    item: Object
  },
  created() {
    console.log("GET ATTRIBUTES NAMES");
    this.getAttributeNames();
    console.log(this.vertexAttributes);
    console.log(this.polygonAttributes);
  },
  methods: {
    ...mapActions("network", ["call"]),
    getAttributeNames() {
      this.call({
        command: "opengeode.attribute.vertex.names",
        args: [this.item.id]
      }).then(names => (this.vertexAttributes = names));
      this.call({
        command: "opengeode.attribute.polygon.names",
        args: [this.item.id]
      }).then(names => (this.polygonAttributes = names));
    }
  },
  watch: {
    select: function(value) {
      this.$store.commit("setObjectStyle", {
        id: this.item.id,
        style: ["color", "type"],
        value
      });
    },
    color: function(value) {
      this.$store.dispatch("mesh/style/setColor", {
        id: this.item.id,
        color: [value.r / 255, value.g / 255, value.b / 255]
      });
    },
    vertexAttributeName: function(value) {
      if (!value) return;
      this.call({
        command: "opengeode.attribute.vertex",
        args: [this.item.id, value]
      });
    },
    polygonAttributeName: function(value) {
      if (!value) return;
      this.call({
        command: "opengeode.attribute.polygon",
        args: [this.item.id, value]
      });
    }
  },
  mounted() {
    this.select = this.item.style.color.type;
    this.vertexAttributeName = this.item.style.color.vertexAttributeName;
    this.polygonAttributeName = this.item.style.color.polygonAttributeName;
    const color = this.item.style.color.value;
    this.color = {
      r: color[0] * 255,
      g: color[1] * 255,
      b: color[2] * 255
    };
  }
};
</script>
