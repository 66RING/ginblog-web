<template>
  <div>
    <Editor :init="init" v-model="content"></Editor>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue"
import tinymce from "./tinymce.min.js"
import "./icons/default/icons.min.js"
import "./themes/silver/theme.min.js"
import "./langs/zh_CN"

// 注册插件
import './plugins/preview/plugin.min.js'
import './plugins/code/plugin.min.js'
import './plugins/paste/plugin.min.js'
import './plugins/wordcount/plugin.min.js'
import './plugins/image/plugin.min.js'
import './plugins/imagetools/plugin.min.js'

export default{
  components: {Editor},
  props: {
    value: {
      type: String,
      default: "",
    }
  },
  data() {
    return{
      init: {
        language: 'zh_CN',
        height: '500px',
        margin: '0',
        padding: '0',
        plugins: 'preview paste wordcount code image imagetools',
        branding: false,
        toolbar: ['undo redo | styleslect fontselect fontsizeselect bold italic | formatselect alignleft aligncenter alignright alignjustify', 'preview paste code | image imagetools'],
        // 上传图片
        images_upload_handler: async (blobInfo, succFun, failFun) => {
          let formdata = new FormData
          formdata.append('file', blobInfo.blob() ,blobInfo.name())
          const {data: res} = await this.$http.post('upload', formdata)
          succFun(res.url)
        }
      },
      content: this.value,
    }
  },
  watch: {
    value(newV){
      this.content = newV
    },
    content(newV){
      this.$emit('input', newV)
    }
  }
}
</script>

<style>
@import url('./skins/ui/oxide-dark/skin.min.css')
</style>
