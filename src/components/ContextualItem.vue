<template>
  <div>
    <v-tooltip bottom>
      <slot name="tooltip"></slot>
      <template #activator="{ on }">
        <v-btn
          icon
          absolute
          :style="btnStyle"
          v-on="on"
          @click="toggleValue = !toggleValue"
        >
          <slot name="btn" :btn-style="btnStyle"></slot>
        </v-btn>
      </template>
    </v-tooltip>
    <div ref="option" style="position: absolute">
      <slot v-if="toggleValue" name="option"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContextualItem",
  props: {
    left: {
      required: true,
      type: Number
    },
    top: {
      required: true,
      type: Number
    },
    btnSize: {
      required: true,
      type: Number
    },
    toggle: {
      type: Boolean,
      default: false
    },
    toggleInit: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    toggleValue: false
  }),
  computed: {
    btnStyle() {
      let style = {
        left: this.left + "px",
        top: this.top + "px",
        width: this.btnSize + "px",
        height: this.btnSize + "px"
      };
      if (this.toggle) {
        style.border = "1px solid " + this.color;
        if (this.toggleValue) {
          style.backgroundColor = this.color;
        }
      }
      return style;
    },
    color() {
      return getComputedStyle(document.documentElement).getPropertyValue(
        "--v-secondary-base"
      );
    }
  },
  watch: {
    toggleValue: function(value) {
      if (this.toggle) {
        this.$parent.$emit("toggle-change", value);
      }
    }
  },
  updated() {
    this.$nextTick(() => {
      const option = this.$refs.option;
      if (this.left < 0) {
        option.style.left = this.left - this.$refs.option.clientWidth + "px";
      } else {
        option.style.left = this.left + this.btnSize + "px";
      }
      if (this.top < 0) {
        option.style.top = this.top - this.$refs.option.clientHeight + "px";
      } else {
        option.style.top = this.top + this.btnSize + "px";
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.toggleValue = this.toggleInit;
    });
  }
};
</script>
