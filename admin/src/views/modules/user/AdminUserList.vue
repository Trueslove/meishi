<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="phone">
                <el-input size="small" v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
         </el-form-item>
         <el-form-item prop="sex">
                  <el-select v-model="searchForm.sex" placeholder="性别" size="small" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('sex')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
         </el-form-item>
      
         <el-form-item prop="status">
                  <el-select v-model="searchForm.status" placeholder="状态" size="small" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('status')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
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
              :action="`${this.$http.BASE_URL}/user/adminUser/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('user:adminUser:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('user:adminUser:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('user:adminUser:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <el-button v-if="hasPermission('user:adminUser:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('user:adminUser:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
        prop="phone"
        show-overflow-tooltip
        sortable="custom"
        label="手机号">
      </el-table-column>
    <el-table-column
        prop="nickName"
        show-overflow-tooltip
        sortable="custom"
        label="微信昵称">
      </el-table-column>
    <el-table-column
        prop="headImage"
        show-overflow-tooltip
        sortable="custom"
        label="头像">
        <template slot-scope="scope" v-if="scope.row.headImage">
          <el-image
            style="height: 50px;width:50px;margin-right:10px;"
            :src="src" v-for="(src, index) in scope.row.headImage.split('|')" :key="index"
            :preview-src-list="scope.row.headImage.split('|')">
          </el-image>
        </template>
      </el-table-column>
    <el-table-column
        prop="sex"
        show-overflow-tooltip
        sortable="custom"
        label="性别">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("sex", scope.row.sex, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="carNum"
        show-overflow-tooltip
        sortable="custom"
        label="名下车辆">
      <template  slot-scope="scope">
          <el-button v-if="hasPermission('user:adminUser:view')" type="text" icon="el-icon-view" size="small" @click="show(scope.row.id)">{{scope.row.carNum}}</el-button>
        </template>
      </el-table-column>
    <el-table-column
        prop="createTime"
        show-overflow-tooltip
        sortable="custom"
        label="注册时间">
      </el-table-column>
    <el-table-column
        prop="status"
        show-overflow-tooltip
        sortable="custom"
        label="状态">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("status", scope.row.status, '-') }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('user:adminUser:edit') && scope.row.status===1" type="text" icon="el-icon-view" size="small" @click="update(scope.row.id,2)">冻结</el-button>
           <el-button v-if="hasPermission('user:adminUser:edit') && scope.row.status===2" type="text" icon="el-icon-view" size="small" @click="update(scope.row.id,1)">解冻</el-button>
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
    <AdminUserForm  ref="adminUserForm" @refreshDataList="refreshList"></AdminUserForm>
    <AdminUserFormVilcatoon  ref="adminUserFormVilcatoon"></AdminUserFormVilcatoon>

  </div>
</template>

<script>
  import AdminUserForm from './AdminUserForm'
  import AdminUserFormVilcatoon from './AdminUserFormVilcatoon'
  export default {
    data () {
      return {
        searchForm: {
          name: '',
          phone: '',
          nickName: '',
          sex: '',
          createTime: '',
          status: ''
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
      AdminUserForm,
      AdminUserFormVilcatoon
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/user/adminUser/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginCreateTime: this.searchForm.createTime[0],
            endCreateTime: this.searchForm.createTime[1],
            ...this.lodash.omit(this.searchForm, 'createTime')
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
        this.$refs.adminUserForm.init('add', '')
      },
      show(id) {
        this.$refs.adminUserFormVilcatoon.init('view', id)
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.adminUserForm.init('edit', id)
      },
      // 冻结
      update (id,status) {
          this.$confirm(`是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.loading = true
          this.$http({
              url: `/user/adminUser/update?id=${id}&status=${status}`,
              method: 'get'
            }).then(({data}) => {
                            this.loading = false
             if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            })
      } )
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
          this.loading = false
          this.$http({
            url: '/user/adminUser/delete',
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
        this.$utils.download('/user/adminUser/import/template')
      },
      exportExcel () {
        let params = {
          beginCreateTime: this.searchForm.createTime[0],
          endCreateTime: this.searchForm.createTime[1],
          ...this.lodash.omit(this.searchForm, 'createTime')
        }
        this.$utils.download('/user/adminUser/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>