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
        prop="carNo"
        show-overflow-tooltip
        sortable="custom"
        label="账号">
      </el-table-column>
    <el-table-column
        prop="frameNumber"
        show-overflow-tooltip
        sortable="custom"
        label="车架号">
      </el-table-column>
    <el-table-column
        prop="engineNumber"
        show-overflow-tooltip
        sortable="custom"
        label="发动机号">
      </el-table-column>
    <el-table-column
        prop="carType"
        show-overflow-tooltip
        sortable="custom"
        label="类型">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
   
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import AdminVehicleList from '../vehicle/AdminVehicleList'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        headImageArra: [],
        inputForm: {
          id: '',
          licensePlate: '',
          frameNumber: '',
          engineNumber: '',
          carTypeId: ''
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
      AdminVehicleList
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
          this.title = '查看名下车辆'
        }
        this.headImageArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
              this.$http({
                url: '/vehicle/adminVehicle/list',
                method: 'get',
                params: {
                  'pageNo': this.pageNo,
                  'pageSize': this.pageSize,
                  'orderBy': this.orderBy,
                  'userId': id,
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
       // 删除
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/vehicle/adminVehicle/delete',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
            }
            this.loading = false
          })
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/user/adminUser/save`,
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