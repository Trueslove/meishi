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
            <el-form-item label="性别" prop="sex"
                :rules="[
                  {required: true, message:'性别 1:男 2女不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.sex" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in sexDict"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="手机号" prop="phone"
                :rules="[
                  {required: true, message:'手机号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.phone" placeholder="请填写手机号"     ></el-input>
           </el-form-item>
        </el-col>
           <el-col :span="12">
            <el-form-item label="名称" prop="nickName"
                :rules="[
                  {required: true, message:'名称号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.nickName" placeholder="请填写名称"     ></el-input>
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
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        headImgArra: [],
        sexDict: [
              {label: '男', value: '1'},
              {label: '女', value: '2'}
           ],
        inputForm: {
          id: '',
          account: '',
          passWord: '',
          headImg: '',
          nickName: '',
          sex: '',
          age: '',
          phone: '',
          autograph: '',
          status: '',
          createTime: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建用户信息`
        } else if (method === 'edit') {
          this.title = '修改用户信息'
        } else if (method === 'view') {
          this.title = '查看用户信息'
        }
        this.headImgArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/bmuser/bmUser/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bmUser)
              this.inputForm.headImg.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.headImgArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
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
              url: `/bmuser/bmUser/save`,
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