<template>
<v-card>
 <div style="text-align: right; padding: 5px 5px 0 0; width: 100%">
        <v-btn dark depressed small color="primary" class="h-0 w-auto" @click="exportReport"><v-icon class="mr-2">mdi-file-export</v-icon>Xuất báo cáo</v-btn>
  </div>
  <v-dialog hide-overlay persistent width="300" content-class="no-padding" v-model="processingDialog">
      <v-card dark color="primary">
        <v-card-text> Đang xử lý
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
</v-card>
</template>
<script>
  export default {
    layout: "default",
    data () {
      return {
        test:'',
        search: '',
        processingDialog:false,
      }
    },
    methods: {
			async exportReport() {
				try {
					const data_seach = {
					};
					this.processingDialog = true
          const res = await this.$axios.$get('/report/syse001/report1',{responseType:'blob'}, data_seach )
          console.log(res)
					if(res) {
						this.processingDialog = false
						this.$notify({
							group: 'notify',
							title: 'Xuất báo cáo thành công!',
							text: res.message,
							duration: 5000
						})
						 let blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
						let url = window.URL.createObjectURL(blob)
						//console.log(url)
						window.open(url)
					} else {
						this.processingDialog = false
						this.$notify({
							group: 'notify',
							title: 'Xuất báo cáo thất bại!',
							text: res.message,
							duration: 5000
						})
					}
				} catch (e) {
					this.processingDialog = false
					this.$notify({
						group: 'notify',
						title: 'Có lỗi xảy ra!',
						text: e.message,
						duration: 5000
					})
				}
      },
      
    }
  }
</script>
