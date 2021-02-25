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
            <el-form-item label="省份" prop="province"
                :rules="[
                  {required: true, message:'省份不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.province" placeholder="请填写省份"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="省份代码" prop="provinceCode"
                :rules="[
                  {required: true, message:'省份代码不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.provinceCode" placeholder="请填写省份代码"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="城市" prop="city"
                :rules="[
                  {required: true, message:'city不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.city" placeholder="请填写city"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="城市代码" prop="cityCode"
                :rules="[
                  {required: true, message:'city_code不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.cityCode" placeholder="请填写city_code"     ></el-input>
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
        inputForm: {
          id: '',
          province: '',
          provinceCode: '',
          city: '',
          cityCode: ''
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
          this.title = `新建violation`
        } else if (method === 'edit') {
          this.title = '修改violation'
        } else if (method === 'view') {
          this.title = '查看violation'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/violation/voViolationNotOpened/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.voViolationNotOpened)
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
              url: `/violation/voViolationNotOpened/save`,
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