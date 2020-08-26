<template>
  <div>
    <a-card>
      <h3>{{id?"编辑文章":"新增文章"}}</h3>
      <a-form-model 
        :model="artInfo" 
        ref="artInfoRef" 
        :rules="artInfoRules"
        :hideRequiredMark="true"
        >
        <a-form-model-item label="文章标题" prop="title">
          <a-input style="width:30%" v-model="artInfo.title"></a-input>
        </a-form-model-item>
        <a-form-model-item label="文章分类" prop="cid">
          <a-select v-model="artInfo.cid" 
            style="width:30%" 
            placeholder="选择分类"
            @change="cateChange"
            >
            <a-select-option 
              v-for="item in catelist" 
              :key="item.id" 
              :value="item.id"
              >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="文章描述" prop="desc">
          <a-input type="textarea" v-model="artInfo.desc"></a-input>
        </a-form-model-item>
        <a-form-model-item label="缩略图" prop="img">
            <a-upload
                name="file"
                listType="picture"
                :defaultFilelist="fileList"
                :action="upUrl"
                :headers="headers"
                @change="upChange"
              >
              <a-button> <a-icon type="upload" /> Click to Upload </a-button>
            </a-upload>

            <br/>
            <template v-if="id">
              <img :src="artInfo.img" style="width:30%;height:20%"/>
            </template>

        </a-form-model-item>
        <a-form-model-item label="文章内容" prop="content">
          <a-input v-model="artInfo.content"></a-input>
        </a-form-model-item>
        <a-form-model-item >
          <a-button 
            type="danger" 
            style="margin-right:15px"
            @click="artOk(artInfo.id)"
            >{{artInfo.id?"更新":"提交"}}</a-button>
          <a-button type="primary" @click="addCancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import  { Url } from '../../plugin/http'
export default {
  props: ["id"],
  data(){
    return {
      artInfo:{
        id: 0,
        title: "",
        cid: undefined,
        desc: "",
        content: "",
        img: "",
      },
      catelist: [],
      upUrl: Url + '/upload',
      headers: {},
      fileList: [],
      artInfoRules: {
        title: [{required:true, message:"title can not be empty", trigger:"blur"}],
        cid: [{required:true, message:"select a category", trigger:"change"}],
        desc: [
          {required:true, message:"input description", trigger:"blur"}, 
          {max:120, message:"max length is 120", trigger:"change"}
        ],
        img: [{required:true, message:"select a img", trigger:"blur"}],
        content: [{required:true, message:"input content", trigger:"blur"}],
      }
    }
  },
  created(){
    this.getCateList()
    this.headers = {Authorization: `Bearer ${window.sessionStorage.getItem('token')}`}
    if(this.id){
      this.getArtInfo(this.id)
    }
  },
  methods: {
  // 查询文章信息
    async getArtInfo(id) {
      const {data: res} = await this.$http.get(`article/info/${id}`)
      if (res.status != 200) return this.$message.error(res.message)
      this.artInfo = res.data
      this.artInfo.id = res.data.ID
    },
  // 获取分类列表
    async getCateList(){
      const {data: res} = await this.$http.get('category')
      if (res.status != 200) return this.$message.error(res.message)
      this.catelist = res.data
    },
    // 选择分类
    cateChange(value){
      this.artInfo.cid = value
    },
    // 点击上传
    upChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        this.$message.success(`图片上传成功`);
        const imgUrl = info.file.response.url
        this.artInfo.img = imgUrl
      } else if (info.file.status === 'error') {
        this.$message.error(`图片上传失败`);
      }
    },
    // 提交或更新
    artOk(id){
      this.$refs.artInfoRef.validate(async (valid)=>{
        if(id === 0){
          const {data: res} = await this.$http.post(`article/add`, this.artInfo)
          if (res.status != 200) return this.$message.error(res.message)
          this.$router.push('/admin/artlist')
          this.$message.success("添加文章成功")
        }else{
          const {data: res} = await this.$http.put(`article/${id}`, this.artInfo)
          if (res.status != 200) return this.$message.error(res.message)
          this.$router.push('/admin/artlist')
          this.$message.success("更新文章成功")
        }
      })
    },
    addCancel(){
      this.$refs.artInfoRef.resetFields()
    }

  },
}
</script>
