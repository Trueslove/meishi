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
            <el-form-item label="图片" prop="bannerUrl"
                :rules="[
                  {required: true, message:'banner_url不能为空', trigger:'blur'}
                 ]">
              <el-upload ref="bannerUrl"
              v-if="visible"
              list-type="picture-card"
                    :action="`${this.$http.BASE_URL}//banner/voBanner/uploadFile`"
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
                       inputForm.bannerUrl = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.bannerUrl = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="5"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="bannerUrlArra">
                    <i class="el-icon-plus"></i>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="跳转类型" prop="type"
                :rules="[
                  {required: true, message:'跳转类型', trigger:'blur'},
                  {validator: validator.isDigits, trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.type" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in getDictList"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="24" v-show="inputForm.type=='1'">
            <el-form-item label="内容" prop="desonp"
                :rules="[
                 ]">
            <WangEditor ref="desonpEditor" v-model="inputForm.desonp"/>
           </el-form-item>
        </el-col>

           <el-col :span="24" v-show="inputForm.type=='2'">
            <el-form-item label="内容" prop="desonp"
                :rules="[
                  {required: true, message:'跳转类型', trigger:'blur'}
                 ]">
             <el-input v-model="inputForm.desonp"></el-input>
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
  import WangEditor from '@/components/editor/WangEditor'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        bannerUrlArra: [],
        inputForm: {
          id: '',
          bannerUrl: '',
          content: '',
          type: '',
          desonp: ''
        },
        getDictList:[
          {value:'1',text:"富文本"},
          {value:'2',text:"外联"},
        ]
      }
    },
    components: {
      WangEditor
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建轮播图`
        } else if (method === 'edit') {
          this.title = '修改轮播图'
        } else if (method === 'view') {
          this.title = '查看轮播图'
        }
        this.bannerUrlArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.$refs.desonpEditor.init('')
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/banner/voBanner/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.voBanner)
              this.$refs.desonpEditor.init(this.inputForm.desonp)
              this.inputForm.bannerUrl.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.bannerUrlArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
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
              url: `/banner/voBanner/save`,
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