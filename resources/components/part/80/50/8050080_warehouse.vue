<template>
  
    <v-card v-if="title!=''">
      <v-btn  
      class="d-flex justify-center"
      :style="'width:100%;background-color: ' +
       (role =='parent'||role =='sub_parent'? '#FA8A1C': role =='sub_parent2'?'#4DD0FF':role =='child'?itemQty>0?'#04D945':'#DFEBDF':'white')+
       ';color: ' + (role =='parent'||role =='sub_parent' ? 'white': role =='sub_parent2'?'white': 'black')+
       ';border: ' + (role =='child' ? '0.5px solid #2F8DFF': '')+
       ';' + (border=='Y'? 'border:3px solid black !important': '')"
      text
      @click="OnClick(pk,role,border,parent)"
         >
          
        <v-row >
             <v-col ></v-col>
            <v-col v-if="isShow">
               <v-row v-if="itemQty>0 && role =='child'" style="text-align:center;"><b style="color:#DE9731;">{{itemQty.toLocaleString()}}</b></v-row>
               <v-row v-else-if="itemQty<=0 && role=='child'"><b style="color:#DE9731">&nbsp;&nbsp;&nbsp;</b></v-row>
              <v-row><div>{{title}}</div></v-row>
                </v-col>
                <v-col v-else>
               <v-row v-if="itemQty>0 && role =='child'" style="text-align:center;"><b style="color:#DE9731;">&nbsp;&nbsp;&nbsp;</b></v-row>
               <v-row v-else-if="itemQty<=0 && role=='child'"><b style="color:#DE9731">&nbsp;&nbsp;&nbsp;</b></v-row>
              <v-row><div>{{title}}</div></v-row>
                </v-col>
             <v-col ></v-col>
        </v-row>
         
         </v-btn>
    
    </v-card>
    <div v-else :style="'width:100%;background-color: ' +
       (role =='parent'||role =='sub_parent'? '#FA8A1C': role =='sub_parent2'?'#4DD0FF':role =='child'?itemQty>0?'#04D945':'#DFEBDF':'white')+
       ';color: ' + (role =='parent'||role =='sub_parent' ? 'white': role =='sub_parent2'?'white': 'black')+
       ';border: ' + (role =='child' ? '0.5px solid #2F8DFF': '')+
       ';' + (border!=''? border: '')">&nbsp;</div>
</template>

<script>

export default {
  name: 'warehouse',
    props: {
        title: {
            type: String,
            default: "",
        },
        itemQty: {
            type: Number,
            default: 0,
        },
        pk: {
            type: Number
        },
        bg: {
            type: Number
        },
        parent: {
            type: Number
        },
        role: {
            type: String,
            default: "",
        },
        border: {
            type: String,
            default: "",
        },
         isShow: {
            type: Boolean,
            default: true,
        },
        

    },
  components: { },
  data: () => ({
    
  }),
  watch: {
 
  },
  mounted(){
    
  },
  computed: {
  
   
  },
  methods: {
   OnClick(pk,role,border,parent) {
        this.$emit("onclick", {
                        PK:pk,
                        Role:role,
                        Border:border,
                        PARENT_PK:parent
                    });
     
    },
  }
}
</script>
