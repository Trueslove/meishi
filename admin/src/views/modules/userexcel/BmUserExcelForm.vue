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
            <el-form-item label="选择用户" prop="userId"
                :rules="[
                  {required: true, message:'请选择', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.userId" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in userMap"
                            :key="item.id"
                            :label="item.content"
                            :value="item.id">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="选择文件" prop="excelId"
                :rules="[
                  {required: true, message:'请选择', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.excelId" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in fileMap"
                            :key="item.id"
                            :label="item.content"
                            :value="item.id">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否可读" prop="sread"
                :rules="[
                  {required: true, message:'请选择', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.sread" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in rMap"
                            :key="item.id"
                            :label="item.content"
                            :value="item.id">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
            <el-col :span="12">
            <el-form-item label="是否可写" prop="writes"
                :rules="[
                  {required: true, message:'请选择', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.writes" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in wMap"
                            :key="item.id"
                            :label="item.content"
                            :value="item.id">
                          </el-option>
                      </el-select>
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
        inputForm: {
          id: '',
          userId: '',
          userName: '',
          excelId: '',
          excelTitle: '',
          isDelete: '',
          isCheck: '',
          headImg: '',
          phone: '',
          sread:'',
          writes:''
        },
        userMap:[],
        fileMap:[],
        rMap:[{"id":1,"content":'是'},{"id":2,"content":'否'}],
        wMap:[{"id":1,"content":'是'},{"id":2,"content":'否'}]
      }
    },
    
    components: {
    },
    activated () {
      this.selectUserAndExcel()
    },
    methods: {
      selectUserAndExcel(){
           this.$http({
          url: '/userexcel/bmUserExcel/findUserAndFile',
          method: 'get'
        }).then(({data}) => {
          if (data && data.success) {
            this.userMap = data.userMap
            this.fileMap = data.fileMap
          }
        })
      },
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建权限`
        } else if (method === 'edit') {
          this.title = '修改权限'
        } else if (method === 'view') {
          this.title = '查看权限'
        }
        this.headImgArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/userexcel/bmUserExcel/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bmUserExcel)
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
              url: `/userexcel/bmUserExcel/save`,
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