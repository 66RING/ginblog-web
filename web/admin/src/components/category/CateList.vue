<template>
  <div>
    <h1>分类列表页面</h1>
    <a-card>
      <a-row :gutter="20">
        <a-col :span="4">
          <a-button type="primary" @click="addCateVisible = true" @ok="addCateOk" @cancel="addCateCancel">New Cate</a-button>
        </a-col>
      </a-row>

      <a-table 
        rowKey="id"
        :columns="columns"
        :pagination="pagination"
        :dataSource="catelist"
        bordered
        @change="handleTableChange"
        >
        <template slot="action" slot-scope="data">
          <div class="actionSlot">
            <a-button type="primary" style="margin-right:15px" @click="editCate(data.id)">Edit</a-button>
            <a-button type="danger" style="margin-right:15px" @click="deleteCate(data.id)">Delete</a-button>
          </div>
        </template>
      </a-table>
    </a-card>

    <!-- New Cate -->
    <a-modal
      title="New Cate"
      :visible="addCateVisible"
      @ok="addCateOk"
      width="60%"
      @cancel="addCateCancel"
      closable
      destroyOnClose
    >
      <a-form-model :model="newCate" :rules="addCateRules" ref="addCateRef">
        <a-form-model-item label="Cate Name" prop="name">
          <a-input v-model="newCate.name"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!--Edit Cate-->
    <a-modal
      title="Edit Cate"
      :visible="editCateVisible"
      closable
      width="60%"
      @ok="editCateOk"
      @cancel="editCateCancel"
    >
      <a-form-model :model="cateInfo" :rules="cateRules" ref="addCateRef">
        <a-form-model-item label="Cate Name" prop="name">
          <a-input v-model="cateInfo.name"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

  </div>
</template>


<script>

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
    key: 'id',
    align: 'center'
  },
  {
    title: 'CateName',
    dataIndex: 'name',
    width: '20%',
    key: 'name',
    align: 'center'
  },
  {
    title: 'Action',
    width: '30%',
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
      catelist: [],
      columns,
      queryParam: {
        pagesize: 5,
        pagenum: 1,
      },
      cateInfo: {
        id: 0,
        name: "",
      },
      newCate: {
        name: "",
      },
      visible: false,
      addCateVisible: false,
      cateRules: {
        name: [
          {required:true, message: "Please input catename", trigger: "blur"},
        ],
      },
      addCateRules: {
        name: [
          {required:true, message: "Please input catename", trigger: "blur"},
        ],
      },

      // Edit Cate
      editCateVisible: false,
    }

  },
  created(){
    this.getCateList()
  },
  methods: {
    async getCateList(){
      const {data: res} = await this.$http.get('category', {
        params:{
          pagesize: this.queryParam.pagesize,
          pagenum: this.queryParam.pagenum,
        },
      })
      if (res.status != 200) return this.$message.error(res.message)
      this.catelist = res.data
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
      this.getCateList()
    },

    // Delete Cate
    async deleteCate(id){
      this.$confirm({
        title: 'Do you want to delete this cate?',
        content: 'When clicked the OK button, there is no way back',
        onOk: async () => {
          const res = await this.$http.delete(`category/${id}`)
          if (res.status != 200) return this.$message.error(res.message)
          this.getCateList()
          this.$message.success("Cate has been delete!")
        },
        onCancel() {},
      });
    },

    // Add Cate
    addCateCancel(){
      this.$refs.addCateRef.resetFields()
      this.addCateVisible = false
      this.$message.info("Add Cancel")
    },
    addCateOk(){
      this.$refs.addCateRef.validate(async (valid) => {
        if(!valid) return this.$message.error("Invalid")
        const {data: res} = await this.$http.post("category/add", {
          name: this.newCate.name,
        })
        if (res.status !=200) return this.$message.error(res.message)
        this.addCateVisible = false
        this.$message.success("Add Cate Success")
        await this.getCateList()
      })
    },

    // Edit Cate
    async editCate(id) {
      this.editCateVisible = true
      const {data: res} = await this.$http.get(`category/${id}`)
      this.cateInfo = res.data
      this.cateInfo.id = id
    },
    editCateCancel(){
      this.$refs.addCateRef.resetFields()
      this.editCateVisible = false
      this.$message.info("Edit Cancel")
    },
    editCateOk(){
      this.$refs.addCateRef.validate(async (valid) => {
        if(!valid) return this.$message.error("Invalid")
        const {data: res} = await this.$http.put(`category/${this.cateInfo.id}`, {
          name: this.cateInfo.name,
        })
        console.log(res)
        if (res.status !=200) return this.$message.error(res.message)
        this.editCateVisible = false
        this.$message.success("Edit Cate Success")
        this.getCateList()
      })

    }
  },
}
</script>

<style scoped>
.actionSlot {
  display: flex;
  justify-content: center;
}
</style>

