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
          <a-button type="primary" @click="addUserVisible = true" @ok="addUserOk" @cancel="addUserCancel">New User</a-button>
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
              <a-button type="primary" style="margin-right:15px" @click="editUser(data.ID)">Edit</a-button>
              <a-button type="danger" @click="deleteUser(data.ID)">Delete</a-button>
            </div>
          </template>
        </a-table>
    </a-card>

    <!-- New User -->
    <a-modal
      title="New User"
      :visible="addUserVisible"
      @ok="addUserOk"
      width="60%"
      @cancel="addUserCancel"
      closable
      destroyOnClose
    >
      <a-form-model :model="userInfo" :rules="userRules" ref="addUserRef">
        <a-form-model-item label="User Name" prop="username">
          <a-input v-model="userInfo.username"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="Password" prop="password">
          <a-input-password v-model="userInfo.password"></a-input-password>
        </a-form-model-item>
        <a-form-model-item has-feedback label="Confirm Password" prop="checkpass">
          <a-input-password v-model="userInfo.checkpass"></a-input-password>
        </a-form-model-item>
        <a-form-model-item label="Is Administor?" prop="role">
          <a-select defaultValue="2" style="120px" @change="adminChange">
            <a-select-option key="1" value="1">Yes</a-select-option>
            <a-select-option key="2" value="2">No</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!--Edit User-->
    <a-modal
      title="Edit User"
      :visible="editUserVisible"
      closable
      width="60%"
      @ok="editUserOk"
      @cancel="editUserCancel"
    >
      <a-form-model :model="userInfo" :rules="userRules" ref="addUserRef">
        <a-form-model-item label="User Name" prop="username">
          <a-input v-model="userInfo.username"></a-input>
        </a-form-model-item>
        <a-form-model-item label="Is Administor?" prop="role">
          <a-select defaultValue="2" style="120px" @change="adminChange">
            <a-select-option key="1" value="1">Yes</a-select-option>
            <a-select-option key="2" value="2">No</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

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
      userInfo: {
        id: 0,
        username: "",
        password: "",
        checkpass: "",
        role: 2
      },
      visible: false,
      addUserVisible: false,
      userRules: {
        username: [
          {required:true, message: "Please input username", trigger: "blur"},
          {min:4, max: 12, message: "UserName should between 4 and 12"},
        ],
        password: [{validator:(rule, value, callback)=>{
          if (this.userInfo.password == ""){
            callback(new Error("Password can't be empty"))
          }
          if([...this.userInfo.password].length < 6 || [...this.userInfo.password].length > 20){
            callback(new Error("Password must be between 6 and 20"))
          }else{
            callback()
          }
        },trigger: "blur"}],
        checkpass: [{ validator: (rule, value, callback) => {
          if (this.userInfo.checkpass == ""){
            callback(new Error("Password can't be empty"))
          }
          if(this.userInfo.password != this.userInfo.checkpass){
            callback(new Error("Inconsistent password"))
          }else{
            callback()
          }
        },trigger: "blur"}]
      },

      // Edit User
      editUserVisible: false,
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

    // Delete User
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
    },

    // Add User
    addUserCancel(){
      this.$refs.addUserRef.resetFields()
      this.addUserVisible = false
      this.$message.info("Add Cancel")
    },
    addUserOk(){
      this.$refs.addUserRef.validate(async (valid) => {
        if(!valid) return this.$message.error("Invalid")
        const {data: res} = await this.$http.post("user/add", {
          username: this.userInfo.username,
          password: this.userInfo.password,
          role: this.userInfo.role
        })
        if (res.status !=200) return this.$message.error(res.message)
        this.addUserVisible = false
        this.$message.success("Add User Success")
        this.getUserList()
      })
    },
    adminChange(value){
      this.userInfo.role = value
    },

    // Edit User
    async editUser(id) {
      this.editUserVisible = true
      const {data: res} = await this.$http.get(`user/${id}`)
      this.userInfo = res.data
      this.userInfo.id = id
    },
    editUserCancel(){
      this.$refs.addUserRef.resetFields()
      this.editUserVisible = false
      this.$message.info("Edit Cancel")
    },
    editUserOk(){
      this.$refs.addUserRef.validate(async (valid) => {
        if(!valid) return this.$message.error("Invalid")
        const {data: res} = await this.$http.put(`user/${this.userInfo.id}`, {
          username: this.userInfo.username,
          role: this.userInfo.role
        })
        console.log(res)
        if (res.status !=200) return this.$message.error(res.message)
        this.editUserVisible = false
        this.$message.success("Edit User Success")
        this.getUserList()
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
