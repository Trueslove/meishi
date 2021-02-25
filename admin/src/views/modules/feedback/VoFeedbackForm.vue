<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="反馈用户" prop="user.id"
                :rules="[
                  {required: true, message:'反馈用户不能为空', trigger:'blur'}
                 ]">
          <GridSelect
            title="选择反馈用户"
            labelName = 'nickName'
            labelValue = 'id'
            :value = "inputForm.user.id"
            :limit="1"
            @getValue='(value) => {inputForm.user.id=value}'
            :columns="[
            {
              prop: 'nickName',
              label: '名称'
            },
            {
              prop: 'phone',
              label: '手机号'
            },
            {
              prop: 'nickName',
              label: '微信昵称'
            }
            ]"
            :searchs="[
            {
              prop: 'nickName',
              label: '名称'
            },
            {
              prop: 'phone',
              label: '手机号'
            },
            {
              prop: 'nickName',
              label: '微信昵称'
            }
            ]"
            dataListUrl="/user/adminUser/list"
            entityBeanName="adminUser"
            queryEntityUrl="/user/adminUser/queryById">
          </GridSelect>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="反馈内容" prop="message"
                :rules="[
                  {required: true, message:'反馈内容不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.message" placeholder="请填写反馈内容"     ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          user: {
            id: ''
          },
          message: ''
        }
      }
    },
    components: {
      GridSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建用户反馈`
        } else if (method === 'edit') {
          this.title = '修改用户反馈'
        } else if (method === 'view') {
          this.title = '查看用户反馈'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/feedback/voFeedback/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.voFeedback)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/feedback/voFeedback/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }
            })
          }
        })
      }
    }
  }
</script>