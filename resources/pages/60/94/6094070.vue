<template>
   <v-container fluid v-resize="onResize">
    <v-row >
      <v-col cols="1">
      </v-col>
      <v-col cols="10">
        <div class=" flex justify-center items-center
          bg-gray-200 border-b border-gray-300">
          <input
          type="file"
          name="pdf"
          id="pdf"
          style="display: none;"
          @change="onUploadPDF"
          class="hidden" />
        <input
          type="file"
          id="image"
          name="image"
          style="display: none;"
          class="hidden"
          @change="onUploadImage" />
        <label
          class="whitespace-no-wrap bg-blue-500 hover:bg-blue-700 text-white
          font-bold py-1 px-3 md:px-4 rounded mr-3 cursor-pointer md:mr-4"
          for="pdf">
          Choose PDF
        </label>
          <div
            class="relative mr-3 flex h-8 bg-gray-400 rounded-sm overflow-hidden
            md:mr-4">
            <label
            class="flex items-center justify-center h-full w-8 hover:bg-gray-500
            cursor-pointer"
            for="image">
            <img src="@/assets/images/image.svg" alt="An icon for adding images" />
          </label>
          <label
            class="flex items-center justify-center h-full w-8 hover:bg-gray-500
            cursor-pointer"
            for="text"
            
            @click="onAddTextField">
            <img src="@/assets/images/notes.svg" alt="An icon for adding text" />
          </label>
          <label
            class="flex items-center justify-center h-full w-8 hover:bg-gray-500
            cursor-pointer"
            @click="onAddDrawing"
            class:cursor-not-allowed="selectedPageIndex < 0"
            class:bg-gray-500="selectedPageIndex < 0">
            <img src="@/assets/images/gesture.svg" alt="An icon for adding drawing" />
          </label>
          </div>
          <div class="justify-center mr-3 md:mr-4 w-full max-w-xs hidden md:flex">
            <img src="@/assets/images/edit.svg" class="mr-2" alt="a pen, edit pdf name" />
            <input
              placeholder="Rename your PDF here"
              type="text"
              class="flex-grow bg-transparent"
              bind:value={pdfName} />
          </div>
          <button
          @click="savePDF"
          class="w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3
          md:px-4 mr-3 md:mr-4 rounded"
          class:cursor-not-allowed="pages.length === 0 || saving || !pdfFile"
          class:bg-blue-700="pages.length === 0 || saving || !pdfFile">
          Save
        </button>
        </div>
      </v-col>
      <v-col cols="1">
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">
      </v-col>
      <v-col cols="10">
        <div class="w-full">
          <div
            class="relative shadow-lg"
            class:shadow-outline="selectedPageIndex"
          >
            <PdfPage
              v-for="(page, pIndex) in pages"
              :id="`the-canvas${pIndex}`"
              :key="pIndex"
              :page="page"
              :scale="pagesScale[pIndex]"
              :allObjects="allObjects[pIndex]"
              :selectedPageIndex="selectedPageIndex"
              @measure="onMeasure"
              @selectPage="selectPage"
              @updateObject="updateObject"
              @deleteObject="deleteObject"
              @selectFontFamily="selectFontFamily"
              @afterClick="afterClick" 
              
              />
          </div>
        </div>
      </v-col>
      <v-col cols="1">
      </v-col>
    </v-row>
    <v-dialog :width="Math.floor(windowWidth*0.4)"  :height="Math.floor(windowHeight*0.4)"  v-model="dialogDrawShow">
      <v-card>
        <v-card-title class="text-h5 d-flex align-center justify-center">CHUYỂN THÀNH HÓA ĐƠN GIẤY</v-card-title>
      </v-card>
      <v-card>
        <Drawing
          :pageScale="pagesScale[selectedPageIndex]"
          />
      </v-card>
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed :color="currentTheme" :class="currentTextColor"  :disabled="isProcessing" :loading="isProcessing" @click="convert">Tiếp tục</v-btn>
          <v-btn outlined color="grey darken-2" :disabled="isProcessing" @click="dialogDrawShow = false">Hủy bỏ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
   </v-container>
   
</template>

<script>
  import VuePdfjsWrapper from 'vue-pdfjs-wrapper';
  import PdfPage from "@/components/control/BasePDFPage.vue";
  import Drawing from "@/components/control/BasePDFDrawing.vue";

  
  export default {
    components: { VuePdfjsWrapper, PdfPage, Drawing},
    data() {
      return {
        src: 'https://test.einvoicevn.com/api/dso/getfiletoken?file_name=/pdf/2024/04/rpt-1714375433731-TID_111_VAT%20INVOICE_IMP_wetax-test.pdf&token=U2FsdGVkX1p1L2u3SRylkLY48ke7gVni35bvhmdL3fQXscG01VydHlp1L2u3Sh227vEVzgB1YnTBoiE29whGSON4aIx6oJIjxMqUYvPafVoX4GSAK7VGHRViNkCAnL6tUtnjjBzWp1L2u3Sg6o',
        scale: 1.5,
        isRenderText: true,
        pdfFile : null,
        pdfName : "",
        pages : [],
        pagesScale : [],
        allObjects : [],
        currentFont : "Times-Roman",
        focusId : null,
        selectedPageIndex : -1,
        saving : false,
        addingDrawing : false,
        scripts:[
              {
                name: 'pdfjsLib',
                src: 'https://unpkg.com/pdfjs-dist@2.3.200/build/pdf.min.js',
              },
              {
                name: 'PDFLib',
                src: 'https://unpkg.com/pdf-lib@1.4.0/dist/pdf-lib.min.js',
              },
              {
                name: 'download',
                src: 'https://unpkg.com/downloadjs@1.4.7',
              },
              { name: 'makeTextPDF', 
                src: 'https://test.einvoicevn.com/api/dso/getfiletoken?file_name=/js/makeTextPDF.js&token=U2FsdGVkX1s1L2a3S4hNCFjlQp1L2u3SqzhM6YqS6imm7LUsfOcXw5uOx67rEM5VvCn2O6ac05YYf6'
               },   
            ],
        assets : {},
        fonts : {
          Courier: {
            correction(size, lineHeight) {
              return (size * lineHeight - size) / 2 + size / 6;
            },
          },
          Helvetica: {
            correction(size, lineHeight) {
              return (size * lineHeight - size) / 2 + size / 10;
            },
          },
          'Times-Roman': {
            correction(size, lineHeight) {
              return (size * lineHeight - size) / 2 + size / 7;
            },
          },
          },
        Fonts : { ...this.fonts,
        標楷體: {
            src: '/CK.ttf', // 9.9 MB
            correction(size, lineHeight) {
              return (size * lineHeight - size) / 2;
            },
          },
        },
        pIndex: 0,
        dialogDrawShow:false,
        isProcessing:false,

      }
    },
    mounted() {
    this.onResize();
  },
  async created() {
    const res = await  fetch("https://test.einvoicevn.com/api/dso/getfiletoken?file_name=/pdf/test.pdf&token=U2FsdGVkX1p1L2u3Szcay2op6GIn9H4oj9QymM8q4BnSebUeStlnEWffwzcWaAhso0s1L2a3S4ha5v");//fetch("./utils/test.pdf");
    const pdfBlob = await res.blob();
      await this.addPDF(pdfBlob);
      this.selectedPageIndex = 0; 
      setTimeout(async () => {
         this.fetchFont(this.currentFont);
         //this.prepareAssets();
         await this.getAsset('pdfjsLib');
         await this.getAsset('PDFLib');
         await this.getAsset('download');
         await this.getAsset('makeTextPDF');
      }, 5000);
  },
  methods: {
      onUploadImage(){},
      convert(){

      },
      savePDF(){}, 
      onAddTextField(){
       

      },
      onAddDrawing(){
        this.dialogDrawShow = true;
      },
      async onUploadPDF(e) {
        console.log("onUploadPDF  ", e);
        const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
        const file = files[0];
        if (!file || file.type !== "application/pdf") return;
        this.selectedPageIndex = -1;
        try {
          await this.addPDF(file);
          this.selectedPageIndex = 0;
        } catch (e) {
          console.log(e);
        }
      },

      async addPDF(file) {
        try {
          const pdf = await this.readAsPDF(file);

          this.pdfName = file.name;
          this.pdfFile = file;
          const numPages = pdf.numPages;
          this.pages = Array(numPages)
            .fill()
            .map((_, i) => pdf.getPage(i + 1));

          this.allObjects = this.pages.map(() => []);
          this.pagesScale = Array(numPages).fill(1);
        } catch (e) {
          console.log("Failed to add pdf.");
          throw e;
        }
      },

      async readAsPDF(file) {
        const pdfjsLib = await this.getAsset('pdfjsLib');

        // Safari possibly get webkitblobresource error 1 when using origin file blob
        const blob = new Blob([file]);
        const url = window.URL.createObjectURL(blob);
        return pdfjsLib.getDocument(url).promise;
      },

      getAsset(name) {
        if (this.assets[name]) return this.assets[name];
        const script = this.scripts.find((s) => s.name === name);
        if (!script) throw new Error(`Script ${name} not exists.`);
        return this.prepareAsset(script);
      },

      prepareAsset({ name, src }) {
        if (this.assets[name]) return this.assets[name];
        this.assets[name] = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => {
            resolve(window[name]);
            console.log(`${name} is loaded.`);
          };
          script.onerror = () => {
            reject(`The script ${name} didn't load correctly.`);
            alert(`Some scripts did not load correctly. Please reload and try again.`)
          };
          document.body.appendChild(script);
        });
        return this.assets[name];
      },

      async prepareAssets() {
          this.scripts.forEach(async (value, index) => {
              console.log("value  ", value);
              await this.prepareAsset(value.name);
        });
      },

      fetchFont(name) {
        if (this.fonts[name]) return this.fonts[name];
        const font = this.Fonts[name];
        if (!font) throw new Error(`Font '${name}' not exists.`);
        this.fonts[name] = fetch(font.src)
          .then((r) => r.arrayBuffer())
          .then((fontBuffer) => {
            const fontFace = new FontFace(name, fontBuffer);
            fontFace.display = 'swap';
            fontFace.load().then(() => document.fonts.add(fontFace));
            return {
              ...font,
              buffer: fontBuffer,
            };
          });
        return this.fonts[name];
      },

      selectPage(index) {
        console.log("  selectPage ", index);
        this.selectedPageIndex = index;
      },

      onMeasure(scale, i) {
        console.log("onMeasure  ", scale, i); 
        this.pagesScale[i] = scale;
      },

      updateObject(objectId, payload) {
        this.allObjects = this.allObjects.map((objects, pIndex) =>
          pIndex == this.selectedPageIndex
            ? objects.map(object =>
                object.id === objectId ? { ...object, ...payload } : object
              )
            : objects
        );
      },

      deleteObject(objectId) {
        this.allObjects = allObjects.map((objects, pIndex) =>
          pIndex == this.selectedPageIndex
            ? objects.filter(object => object.id !== objectId)
            : objects
        );
      },

      selectFontFamily(event) {
        const name = event.detail.name;
        this.fetchFont(name);
        this.currentFont = name;
      },

      afterClick(event)
      {
        console.log("afterClick main ",event);
      },




    }  
  } 
</script>
<style scoped>
  @import "@/assets/style/bundle.css";
</style>