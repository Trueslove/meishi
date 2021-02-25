<template>
    <div>
    <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
       <el-table
      :data="dataList"
      border
      size="medium"
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column
        prop="violationTime"
        show-overflow-tooltip
        sortable="custom"
        label="时间">
      </el-table-column>
   <el-table-column
        prop="place"
        show-overflow-tooltip
        sortable="custom"
        label="地点">
      </el-table-column>
   <el-table-column
        prop="behavior"
        show-overflow-tooltip
        sortable="custom"
        label="行为">
      </el-table-column>
  
    <el-table-column
        prop="fine"
        show-overflow-tooltip
        sortable="custom"
        label="罚款金额">
      </el-table-column>
    <el-table-column
        prop="score"
        show-overflow-tooltip
        sortable="custom"
        label="扣分">
      </el-table-column>
    </el-table>
  </el-dialog>
  </div>
</template>
<script>
  import GridSelect from '@/components/gridSelect'
  import AdminIquiryList from '../iquiry/AdminIquiryList'
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
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        
        dataListSelections: [],
        isSearchCollapse: false,
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      GridSelect,
      AdminIquiryList
    },
    methods: {
         init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建用户`
        } else if (method === 'edit') {
          this.title = '修改用户'
        } else if (method === 'view') {
          this.title = '查询结果'
        }
        this.headImageArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
              this.$http({
                url: '/iquiry/adminIquiry/list',
                method: 'get',
                params: {
                  'pageNo': this.pageNo,
                  'pageSize': this.pageSize,
                  'orderBy': this.orderBy,
                  "orderNum": id,
                  ...this.searchForm
                }
              }).then(({data}) => { 
                   console.log(data)
                if (data && data.success) {
                  this.dataList = data.page.list
                 this.dataList.forEach(element => {
                    element.carNo = element.licensePlate+"-"+element.lastDigitsNum
                  });
                  this.total = data.page.count
                  console.log(this.dataList,"00000")
                  this.loading = false
            }
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