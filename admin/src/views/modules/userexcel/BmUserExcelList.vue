<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="userName">
                <el-input size="small" v-model="searchForm.userName" placeholder="用户昵称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="excelTitle">
                <el-input size="small" v-model="searchForm.excelTitle" placeholder="文件标题" clearable></el-input>
         </el-form-item>
         <el-form-item prop="phone">
                <el-input size="small" v-model="searchForm.phone" placeholder="绑定人手机号" clearable></el-input>
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
              :action="`${this.$http.BASE_URL}/userexcel/bmUserExcel/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('userexcel:bmUserExcel:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('userexcel:bmUserExcel:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('userexcel:bmUserExcel:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <el-button v-if="hasPermission('userexcel:bmUserExcel:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('userexcel:bmUserExcel:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
        prop="userName"
        show-overflow-tooltip
        sortable="custom"
        label="用户昵称">
      </el-table-column>
    <el-table-column
        prop="excelTitle"
        show-overflow-tooltip
        sortable="custom"
        label="文件内容">
        <template slot-scope="scope" v-if="scope.row.excelTitle">
            <a :href="item" target="_blank" :key="index" v-for="(item, index) in scope.row.excelTitle.split('|')">
                {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
            </a>
        </template>
      </el-table-column>
    <el-table-column
        prop="isCheck"
        show-overflow-tooltip
        sortable="custom"
        label="是否选中">
       <template slot-scope="scope" v-if="scope.row.isCheck">
          <div v-if='scope.row.isCheck==1'>已选中</div>
            <div v-else>未选中</div>
        </template>
      </el-table-column>
          <el-table-column
        prop="sread"
        show-overflow-tooltip
        sortable="custom"
        label="是否可读">
       <template slot-scope="scope" v-if="scope.row.sread">
          <div v-if='scope.row.sread==1'>可读</div>
            <div v-else>不可读</div>
        </template>
      </el-table-column>
               <el-table-column
        prop="writes"
        show-overflow-tooltip
        sortable="custom"
        label="是否可写">
       <template slot-scope="scope" v-if="scope.row.writes">
          <div v-if='scope.row.writes==1'>可写</div>
            <div v-else>不可写</div>
        </template>
      </el-table-column>
    <el-table-column
        prop="headImg"
        show-overflow-tooltip
        sortable="custom"
        label="绑定人头像">
        <template slot-scope="scope" v-if="scope.row.headImg">
          <el-image
            style="height: 50px;width:50px;margin-right:10px;"
            :src="src" v-for="(src, index) in scope.row.headImg.split('|')" :key="index"
            :preview-src-list="scope.row.headImg.split('|')">
          </el-image>
        </template>
      </el-table-column>
    <el-table-column
        prop="phone"
        show-overflow-tooltip
        sortable="custom"
        label="绑定人手机号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('userexcel:bmUserExcel:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('userexcel:bmUserExcel:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('userexcel:bmUserExcel:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
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
    <BmUserExcelForm  ref="bmUserExcelForm" @refreshDataList="refreshList"></BmUserExcelForm>
  </div>
</template>

<script>
  import BmUserExcelForm from './BmUserExcelForm'
  export default {
    data () {
      return {
        searchForm: {
          userName: '',
          excelTitle: '',
          phone: ''
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
      BmUserExcelForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/userexcel/bmUserExcel/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
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
        this.$refs.bmUserExcelForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.bmUserExcelForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.bmUserExcelForm.init('view', id)
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
            url: '/userexcel/bmUserExcel/delete',
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
        this.$utils.download('/userexcel/bmUserExcel/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/userexcel/bmUserExcel/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>