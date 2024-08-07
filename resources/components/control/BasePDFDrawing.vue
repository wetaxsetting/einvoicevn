<template>
  <div
    class="absolute left-0 top-0 select-none"
    :style="{ width: width + dw + 'px', height: (width + dw) / ratio + 'px', transform: `translate(${x + dx}px, ${y + dy}px)` }">
    <div
      @mousedown="handlePanStart"
      @mousemove="handlePanMove"
      @mouseup="handlePanEnd"
      class="absolute w-full h-full cursor-grab border border-gray-400 border-dashed"
      :class="{ 'cursor-grabbing': operation === 'move', operation }">
      <div
        data-direction="left-top"
        class="absolute left-0 top-0 w-10 h-10 bg-green-400 rounded-full cursor-nwse-resize
        transform -translate-x-1/2 -translate-y-1/2 md:scale-25"></div>
      <div
        data-direction="right-bottom"
        class="absolute right-0 bottom-0 w-10 h-10 bg-green-400 rounded-full cursor-nwse-resize
        transform translate-x-1/2 translate-y-1/2 md:scale-25"></div>
    </div>
    <div @click="onDelete" class="absolute left-0 top-0 right-0 w-12 h-12 m-auto rounded-full bg-white cursor-pointer transform -translate-y-1/2 md:scale-25">
      <img class="w-full h-full" src="@/assets/images/delete.svg" alt="delete object" />
    </div>
    <svg :ref="svg" width="100%" height="100%">
      <path
        stroke-width="5"
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke="black"
        fill="none"
        :d="path" />
    </svg>
  </div>
</template>


<script>
  import { onMounted, ref, watch } from 'vue';
  export default {
    props: {
      originWidth: Number,
      originHeight: Number,
      width: Number,
      x: Number,
      y: Number,
      path: String
    },
    emits: ['update', 'delete'],
    setup(props, { emit }) {
      const pageScale = ref(1);
      const dispatch = (type, data) => emit(type, data);
      let startX;
      let startY;
      const svg = ref(null);
      let operation = "";
      let dx = 0;
      let dy = 0;
      let dw = 0;
      let direction = "";
      const ratio = props.originWidth / props.originHeight;

      function render() {
        //this.$refs['svg'].value.setAttribute("viewBox", `0 0 ${props.originWidth} ${props.originHeight}`);
        //svg.value.setAttribute("viewBox", `0 0 ${props.originWidth} ${props.originHeight}`);
      }

      function handlePanMove(event) {
        const _dx = (event.detail.x - startX) / pageScale.value;
        const _dy = (event.detail.y - startY) / pageScale.value;
        if (operation === "move") {
          dx = _dx;
          dy = _dy;
        } else if (operation === "scale") {
          if (direction === "left-top") {
            let d = Infinity;
            d = Math.min(_dx, _dy * ratio);
            dx = d;
            dw = -d;
            dy = d / ratio;
          }
          if (direction === "right-bottom") {
            let d = -Infinity;
            d = Math.max(_dx, _dy * ratio);
            dw = d;
          }
        }
      }

      function handlePanEnd(event) {
        if (operation === "move") {
          dispatch("update", {
            x: props.x + dx,
            y: props.y + dy
          });
          dx = 0;
          dy = 0;
        } else if (operation === "scale") {
          dispatch("update", {
            x: props.x + dx,
            y: props.y + dy,
            width: props.width + dw,
            scale: (props.width + dw) / props.originWidth
          });
          dx = 0;
          dy = 0;
          dw = 0;
          direction = "";
        }
        operation = "";
      }

      function handlePanStart(event) {
        startX = event.detail.x;
        startY = event.detail.y;
        if (event.detail.target === event.currentTarget) {
          return (operation = "move");
        }
        operation = "scale";
        direction = event.detail.target.dataset.direction;
      }

      function onDelete() {
        dispatch("delete");
      }

      onMounted(render);

      return {
        pageScale,
        startX,
        startY,
        svg,
        operation,
        dx,
        dy,
        dw,
        direction,
        ratio,
        handlePanMove,
        handlePanEnd,
        handlePanStart,
        onDelete
      };
    }
  };
</script>

<style scoped>
  .operation {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>

