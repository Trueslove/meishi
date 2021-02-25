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
        <el-col :span="24">
            <el-form-item label="美食图片" prop="picture"
                :rules="[
                  {required: true, message:'美食图片不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="picture"
              v-if="visible"
              list-type="picture-card"
                    :action="`${this.$http.BASE_URL}//meishilist/bFood/upload`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }"
                    :on-success="(response, file, fileList) => {
                       inputForm.picture = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.picture = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="5"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="pictureArra">
                    <i class="el-icon-plus"></i>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="美食名称" prop="foodName"
                :rules="[
                  {required: true, message:'美食名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.foodName" placeholder="请填写美食名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="食物描述" prop="foodDescription"
                :rules="[
                  {required: true, message:'食物描述不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.foodDescription" placeholder="请填写食物描述"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="地址" prop="province"
                :rules="[
                  {required: true, message:'地址不能为空', trigger:'blur'}
                 ]">
              <el-cascader
                size="large"
                :options="regionData"
                v-model="inputForm.province">
              </el-cascader>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="食物地址" prop="address"
                :rules="[
                  {required: true, message:'食物地址不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.address" placeholder="请填写食物地址"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="美食类型" prop="foodType"
                :rules="[
                  {required: true, message:'美食类型不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.foodType" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in getDictList"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="美食价格" prop="money"
                :rules="[
                  {required: true, message:'美食价格', trigger:'blur'},
                  {validator: validator.isDigits, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.money" placeholder="请填写美食价格"     ></el-input>
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
  import { regionData } from 'element-china-area-data'
  export default {
    data () {
      return {
        regionData: regionData,
        title: '',
        method: '',
        visible: false,
        loading: false,
        pictureArra: [],
        getDictList:[],
        inputForm: {
          id: '',
          picture: '',
          foodName: '',
          foodDescription: '',
          address: '',
          province: [],
          city: '',
          country: '',
          highPraise: '',
          foodType: '',
          money: ''
        }
      }
    },
    created() {
      this.regionData.forEach(item => {
        item.value = item.label
        item.children.forEach(itemCity => {
          itemCity.value = itemCity.label
          itemCity.children.forEach(itemq => {
            itemq.value = itemq.label
          })
        })
      })
    },
    components: {
    },
    methods: {
      handleChange (value) {
        console.log(value)
      },
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建美食信息`
        } else if (method === 'edit') {
          this.title = '修改美食信息'
        } else if (method === 'view') {
          this.title = '查看美食信息'
        }
        this.pictureArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view' || method==='add') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/meishilist/bFood/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bFood)
              this.getDictList= data.foodTypeList
              this.inputForm.picture.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.pictureArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
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
            let province = this.inputForm.province
            this.inputForm.city = province[1]
            this.inputForm.country = province[2]
            this.inputForm.province = province[0]
            this.$http({
              url: `/meishilist/bFood/save`,
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