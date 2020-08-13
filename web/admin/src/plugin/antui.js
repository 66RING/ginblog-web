import Vue from 'vue'
import { Message, Button, FormModel, Input, Icon, message } from 'ant-design-vue'

message.config({
  top: '60px',
  duration: 2,
  macCount: 3
})

Vue.use(Button)
Vue.use(FormModel)
Vue.use(Input)
Vue.use(Icon)

Vue.prototype.$message = Message
