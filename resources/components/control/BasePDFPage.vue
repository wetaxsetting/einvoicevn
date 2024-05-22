<template>
  <div>
    <canvas
      ref="canvas"
      class="max-w-full"
      :style="'width: ' + width + 'px;'"
      :width="width"
      :height="height" 
      @click="afterClick"
      />
  </div>
</template>

<script>
  export default {
    name: "base-paged-pdf-view",
    props: ["id", "page", "scale", "allObjects", "selectedPageIndex"],
    data() {
      return {
        //page: null,
        canvas: null,
        width: 0,
        height: 0,
        clientWidth: 0,
        mounted: false
      };
    },
    mounted() {
      const dispatch = (eventName, eventData) => {
        //console.log("dispatching", eventName, eventData);
        this.$emit(eventName, eventData);
      };

      const measure = () => {
        dispatch("measure", {
          scale: this.$refs['canvas'].clientWidth / this.width
        });
      };

      const render = async () => {
        const _page = await this.page;
        //console.log("_page   ", _page);
        // const canvas = document.getElementById(`pdf-canvas`);
        const context = this.$refs['canvas'].getContext("2d");
        const viewport = _page.getViewport({ scale: 1, rotation: 0 });
        this.width = viewport.width;
        this.height = viewport.height;
        await _page.render({
          canvasContext: context,
          viewport
        }).promise;
        measure();
        window.addEventListener("resize", measure);
      };

      render();

      this.$once("hook:beforeDestroy", () => {
        window.removeEventListener("resize", measure);
      });
    },
    watch: {
      selectedPageIndex(value) {
        //console.log("selectedPageIndex", value);
        //this.render();
      }
    },

    methods: {
      afterClick(value) {
        console.log("afterClick POP", value, "selectedPageIndex  ", this.selectedPageIndex);
        this.$emit("afterClick", value);
      }
    }
  };
</script>
