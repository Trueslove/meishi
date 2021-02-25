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
            <el-form-item label="支付金额" prop="amount"
                :rules="[
                  {required: true, message:'支付金额不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.amount" placeholder="请填写支付金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="用户Id" prop="user.id"
                :rules="[
                  {required: true, message:'用户Id不能为空', trigger:'blur'}
                 ]">
          <GridSelect
            title="选择用户Id"
            labelName = 'name'
            labelValue = 'id'
            :value = "inputForm.user.id"
            :limit="1"
            @getValue='(value) => {inputForm.user.id=value}'
            :columns="[
            {
              prop: 'name',
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
              prop: 'name',
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
            <el-form-item label="是否支付成功 1:成功 2:失败" prop="isSuccess"
                :rules="[
                  {required: true, message:'是否支付成功 1:成功 2:失败不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.isSuccess" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('yes_no')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="支付时间" prop="createTime"
                :rules="[
                  {required: true, message:'支付时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.createTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
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
          amount: '',
          user: {
            id: ''
          },
          isSuccess: '',
          createTime: ''
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
          this.title = `新建records`
        } else if (method === 'edit') {
          this.title = '修改records'
        } else if (method === 'view') {
          this.title = '查看records'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/records/voFundRecords/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.voFundRecords)
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
              url: `/records/voFundRecords/save`,
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