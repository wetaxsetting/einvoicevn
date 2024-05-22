<template>
  <canvas :id="`the-canvas${index}`" style="border: 1px solid"></canvas>
</template>

<script setup>
import { onMounted, defineProps } from 'vue'

const { file, index } = defineProps(['file', 'index'])

onMounted(() => {
  import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.mjs').then((pdfjsLib) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'

    if (!file) return

    const fileReader = new FileReader()
    fileReader.onload = () => {
      const array = new Uint8Array(fileReader.result)
      const loadingTask = pdfjsLib.getDocument(array)
      loadingTask.promise.then(
        (pdf) => {
          const pageNumber = 1
          pdf.getPage(pageNumber).then((page) => {
            const scale = 1.5
            const viewport = page.getViewport({ scale })

            const canvas = document.getElementById(`the-canvas${index}`)
            const context = canvas.getContext('2d')
            canvas.height = viewport.height
            canvas.width = viewport.width

            // Render PDF page into canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            }
            page.render(renderContext)
          })
        },
        (reason) => {
          // PDF loading error
          console.error(reason)
        }
      )
    }
    fileReader.readAsArrayBuffer(file)
  })
})
</script>

<style>

</style>