<template>
  <div>
    <h1>文章列表页面</h1>
    <a-card>
      <a-row :gutter="20">
        <a-col :span="6">
          <a-input-search 
            v-model="queryParam.title"
            placeholder="Enter Art Name to Search"
            enter-button
            allowClear
            @search="getArtList"
          />
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="$router.push('/admin/addart')">New Art</a-button>
        </a-col>

        <a-col :span="6" :offset="4">
          <a-select defaultValue="Search Cate" style="width:200px" @change="CateChange">
            <a-select-option 
              v-for="item in catelist"
              :key="item.id" 
              :value="item.id"
              >{{item.name}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <a-table 
        rowKey="ID"
        :columns="columns"
        :pagination="pagination"
        :dataSource="artlist"
        bordered
        @change="handleTableChange"
        >
        <span class="ArtImg" slot="img" slot-scope="img">
          <img :src="img"/>
        </span>
        <template slot="action" slot-scope="data">
          <div class="actionSlot">
            <a-button 
              type="primary" 
              size="small" 
              style="margin-right:15px" 
              @click="$router.push(`/admin/addart/${data.ID}`)"
              >Edit</a-button>
            <a-button 
              type="danger" 
              size="small" 
              style="margin-right:15px" 
              @click="deleteArt(data.ID)"
              >Delete</a-button>
          </div>
        </template>
      </a-table>
    </a-card>

  </div>
</template>


<script>

const columns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    width: '5%',
    key: 'id',
    align: 'center'
  },
  {
    title: 'Category',
    dataIndex: 'Category.name',
    width: '10%',
    key: 'name',
    align: 'center'
  },
  {
    title: 'Aricle Title',
    dataIndex: 'title',
    width: '10%',
    key: 'role',
    align: 'center',
  },
  {
    title: 'Description',
    dataIndex: 'desc',
    width: '20%',
    key: 'desc',
    align: 'center',
  },
  {
    title: 'Image',
    dataIndex: 'img',
    width: '20%',
    key: 'img',
    scopedSlots: {customRender: 'img'},
    align: 'center',
  },
  {
    title: 'Action',
    width: '15%',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: 'center',
  }
]

export default{
  data(){
    return {
      pagination: {
        pageSizeOptions: ['5', '10', '20'],
        pageSize: 5,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共${total}条`,
      },
      artlist: [],
      catelist: [],
      columns,
      queryParam: {
        title: "",
        pagesize: 5,
        pagenum: 1,
      },
    }

  },
  created(){
    this.getArtList()
    this.getCateList()
  },
  methods: {
    async getArtList(){
      const {data: res} = await this.$http.get('article', {
        params:{
          title: this.queryParam.title,
          pagesize: this.queryParam.pagesize,
          pagenum: this.queryParam.pagenum,
        },
      })
      if (res.status != 200) return this.$message.error(res.message)
      this.artlist = res.data
      this.pagination.total = res.total
    },

    // 重来
    handleTableChange(pagination, filters, sorter){
      var pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.queryParam.pagesize = pagination.pageSize
      this.queryParam.pagenum = pagination.current

      if(pagination.pageSize != this.pagination.pageSize){
        this.queryParam.pagenum = 1
        pager.current = 1
      }
      this.pagination = pager
      this.getArtList()
    },

    // Delete Art
    async deleteArt(id){
      this.$confirm({
        title: 'Do you want to delete this art?',
        content: 'When clicked the OK button, there is no way back',
        onOk: async () => {
          const res = await this.$http.delete(`article/${id}`)
          if (res.status != 200) return this.$message.error(res.message)
          this.getArtList()
          this.$message.success("Art has been delete!")
        },
        onCancel() {},
      });
    },

    // Get Cate Info
    async getCateList(){
      const {data: res} = await this.$http.get('category')
      if (res.status != 200) return this.$message.error(res.message)
      this.catelist = res.data
      this.pagination.total = res.total
    },

    // Cate Change
    CateChange(value){
      this.GetCateArt(value)
    },
    async GetCateArt(id){
      const {data: res} = await this.$http.get(`article/list/${id}`)
      if (res.status != 200) return this.$message.error(res.message)
      this.artlist = res.data
      this.pagination.total = res.total
    },






    // Add Art
    addArtCancel(){
      this.$refs.addArtRef.resetFields()
      this.addArtVisible = false
      this.$message.info("Add Cancel")
    },
    addArtOk(){
      this.$refs.addArtRef.validate(async (valid) => {
        if(!valid) return this.$message.error("Invalid")
        const {data: res} = await this.$http.post("art/add", {
          artname: this.newArt.artname,
          password: this.newArt.password,
          role: this.newArt.role
        })
        if (res.status !=200) return this.$message.error(res.message)
        this.addArtVisible = false
        this.$message.success("Add Art Success")
        this.getArtList()
      })
    },
    adminChange(checked){
      if(checked){
        this.artInfo.role = 1
      }else{
        this.artInfo.role = 2
      }
    },
  },
}
</script>

<style scoped>
.actionSlot {
  display: flex;
  justify-content: center;
}

.ArtImg{
  height: 100%;
  width: 100%;
}

.ArtImg img{
  width: 100px;
  height: 80px;
}
</style>

