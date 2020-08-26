import Vue from 'vue'
import { 
  Layout,
  Message,
  Button,
  FormModel,
  Input,
  Icon,
  message,
  Card,
  Table,
  Row,
  Col,
  ConfigProvider,
  Modal,
  Menu,
  Switch,
  Upload,
  Select
} from 'ant-design-vue'

message.config({
  top: '60px',
  duration: 2,
  macCount: 3
})

Vue.use(Select)
Vue.use(Menu)
Vue.use(Upload)
Vue.use(Switch)
Vue.use(Modal)
Vue.use(ConfigProvider)
Vue.use(Card)
Vue.use(Table)
Vue.use(Row)
Vue.use(Col)
Vue.use(Layout)
Vue.use(Button)
Vue.use(FormModel)
Vue.use(Input)
Vue.use(Icon)

Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = Message
