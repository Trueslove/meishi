<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="phone">
                <el-input size="small" v-model="searchForm.phone" placeholder="请输入账号" clearable></el-input>
         </el-form-item>
              <el-form-item prop="carNo">
                <el-input size="small" v-model="searchForm.carNo" placeholder="请输入车牌号" clearable></el-input>
         </el-form-item>
      
         <el-form-item prop="tradNo">
                <el-input size="small" v-model="searchForm.tradNo" placeholder="交易单号" clearable></el-input>
         </el-form-item>
         <el-form-item prop="createTime">
               <el-date-picker
                    v-model="searchForm.createTime"
                    type="daterange"
                    size="small"
                    align="right"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                 </el-date-picker>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
      <el-form :inline="true" v-show="isImportCollapse"  class="query-form" ref="importForm">
         <el-form-item>
          <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
         </el-form-item>
         <el-form-item prop="loginName">
            <el-upload
              class="upload-demo"
              :action="`${this.$http.BASE_URL}/records/voFundRecords/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <el-button v-if="hasPermission('records:voFundRecords:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('records:voFundRecords:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group>
      </el-row>
    <el-table
      :data="dataList"
      border
      size="medium"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column
        prop="id"
        show-overflow-tooltip
        sortable="custom"
        label="交易单号">
      </el-table-column>
   <el-table-column
        prop="user.phone"
        show-overflow-tooltip
        sortable="custom"
        label="账号">
      </el-table-column>
   <el-table-column
        prop="carNo"
        show-overflow-tooltip
        sortable="custom"
        label="车牌号">
      </el-table-column>
   <el-table-column
        prop="NullData"
        show-overflow-tooltip
        sortable="custom"
        label="查询结果">
            <template slot-scope="scope">
               <el-button type="text"   icon="el-icon-view" size="small" @click="view(scope.row.id)">查看详情</el-button>
            </template>
      </el-table-column>
    <el-table-column
        prop="amount"
        show-overflow-tooltip
        sortable="custom"
        label="支付金额">
      </el-table-column>
    <el-table-column
        prop="createTime"
        show-overflow-tooltip
        sortable="custom"
        label="交易时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
    <VoFundRecordsForm  ref="voFundRecordsForm" @refreshDataList="refreshList"></VoFundRecordsForm>
    <VoFundRecordsFormChilde  ref="voFundRecordsFormChilde"></VoFundRecordsFormChilde>
  </div>
</template>

<script>
  import VoFundRecordsForm from './VoFundRecordsForm'
  import VoFundRecordsFormChilde from './VoFundRecordsFormChilde'
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        searchForm: {
          payMothed: '',
          user: {
            id: ''
          },
          isSuccess: '',
          vehicleId: '',
          createTime: '',
          phone: '',
          carNo: '',
          tradNo: '',
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
      VoFundRecordsForm,
      VoFundRecordsFormChilde
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/records/voFundRecords/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginCreateTime: this.searchForm.createTime[0],
            endCreateTime: this.searchForm.createTime[1],
            "phone":this.searchForm.phone,
            "carNo":this.searchForm.carNo,
            "tradNo":this.searchForm.tradNo,
            ...this.lodash.omit(this.searchForm, 'createTime')
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            console.log(this.dataList)
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },

    // 排序
      sortChangeHandle (obj) {
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      // 新增
      add () {
        this.$refs.voFundRecordsForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.voFundRecordsForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.voFundRecordsFormChilde.init('view', id)
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
            url: '/records/voFundRecords/delete',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      // 导入成功
      uploadSuccess (res, file) {
        if (res.success) {
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
      },
      // 下载模板
      downloadTpl () {
        this.$utils.download('/records/voFundRecords/import/template')
      },
      exportExcel () {
        let params = {
          beginCreateTime: this.searchForm.createTime[0],
          endCreateTime: this.searchForm.createTime[1],
          ...this.lodash.omit(this.searchForm, 'createTime')
        }
        this.$utils.download('/records/voFundRecords/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>