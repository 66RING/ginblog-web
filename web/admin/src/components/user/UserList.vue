<template>
  <div>
    <h1>用户列表页面</h1>
    <a-card>
      <a-row :gutter="20">
        <a-col :span="6">
          <a-input-search 
            v-model="queryParam.username"
            placeholder="Enter User Name to Search"
            enter-button
            allowClear
            @search="getUserList"
          />
        </a-col>
        <a-col :span="4">
          <a-button type="primary">New</a-button>
        </a-col>
      </a-row>

      <a-table 
        rowKey="username"
        :columns="columns"
        :pagination="pagination"
        :dataSource="userlist"
        bordered
        @change="handleTableChange"
        >
          <span slot='role' slot-scope="role">{{role == 1?'管理员':'订阅者'}}</span>
          <template slot="action" slot-scope="data">
            <div class="actionSlot">
              <a-button type="primary" style="margin-right:15px;">Edit</a-button>
              <a-button type="danger" @click="deleteUser(data.ID)">Delete</a-button>
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
    width: '10%',
    key: 'id',
    align: 'center'
  },
  {
    title: 'UserName',
    dataIndex: 'username',
    width: '20%',
    key: 'username',
    align: 'center'
  },
  {
    title: 'Role',
    dataIndex: 'role',
    width: '20%',
    key: 'role',
    scopedSlots: {customRender: 'role'},
    align: 'center',
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
      userlist: [],
      columns,
      queryParam: {
        username: "",
        pagesize: 5,
        pagenum: 1,
      },
      visible: false,
    }

  },
  created(){
    this.getUserList()
  },
  methods: {
    async getUserList(){
      const {data: res} = await this.$http.get('user', {
        params:{
          username: this.queryParam.username,
          pagesize: this.queryParam.pagesize,
          pagenum: this.queryParam.pagenum,
        },
      })
      if (res.status != 200) return this.$message.error(res.message)
      this.userlist = res.data
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
      this.getUserList()
    },
    async deleteUser(id){
      this.$confirm({
        title: 'Do you want to delete this user?',
        content: 'When clicked the OK button, there is no way back',
        onOk: async () => {
          const res = await this.$http.delete(`user/${id}`)
          if (res.status != 200) return this.$message.error(res.message)
          this.getUserList()
          this.$message.success("User has been delete!")
        },
        onCancel() {},
      });
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
