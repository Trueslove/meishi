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
            <el-form-item label="车牌号前两位 代表省和市" prop="licensePlate"
                :rules="[
                  {required: true, message:'车牌号前两位 代表省和市不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.licensePlate" placeholder="请填写车牌号前两位 代表省和市"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="尾号" prop="lastDigitsNum"
                :rules="[
                  {required: true, message:'尾号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.lastDigitsNum" placeholder="请填写尾号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="车辆照片" prop="pictureImage"
                :rules="[
                  {required: true, message:'车辆照片不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.pictureImage" placeholder="请填写车辆照片"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="frame_number" prop="frameNumber"
                :rules="[
                  {required: true, message:'frame_number不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.frameNumber" placeholder="请填写frame_number"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="car_type_id" prop="carTypeId"
                :rules="[
                  {required: true, message:'car_type_id不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.carTypeId" placeholder="请填写car_type_id"     ></el-input>
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
          licensePlate: '',
          lastDigitsNum: '',
          pictureImage: '',
          frameNumber: '',
          carTypeId: ''
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
          this.title = `新建vehicle`
        } else if (method === 'edit') {
          this.title = '修改vehicle'
        } else if (method === 'view') {
          this.title = '查看vehicle'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/vehicle/adminVehicle/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.adminVehicle)
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
              url: `/vehicle/adminVehicle/save`,
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