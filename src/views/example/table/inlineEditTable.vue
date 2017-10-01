<template>
  <div class="app-container calendar-list-container" style="width: 50%;margin-left: 25%">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="支持模糊搜索" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="setting" @click="handleReset">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :data="list" @sort-change="sortBranch" v-loading.body="listLoading" border fit highlight-current-row>

      <el-table-column align="center" label="编号" width="280">
        <template scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="260px" label="品牌名称" sortable="custom">
        <template scope="scope">
          <el-input @keyup.enter.native="handleModifyName(scope.row)" v-show="scope.row.edit" size="small" v-model="scope.row.branchName"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.branchName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template scope="scope">
          <el-button :type="scope.row.edit?'success':'primary'" @click="handleModifyName(scope.row)" size="small" icon="edit">{{ scope.row.edit?'完成':'编辑' }}</el-button>
          <el-button icon="delete" v-if="scope.row.status!= 0" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container" align="right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="tiny">
      <el-form class="small-space" :model="temp" label-position="top" label-width="70px">
        <el-form-item label="品牌名称" placeholder="请输入品牌名称">
          <el-input v-model="temp.branchName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchBranch, addBranch, updateBranch } from '@/api/article'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'Branch',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        branchName: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        sort: 1,
        name: undefined
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchBranch(this.listQuery).then(response => {
        const result = response.data.result
        this.list = result.items.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.total = result.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.getList()
    },
    handleReset() {
      this.listQuery.name = undefined
      this.getList()
    },
    handleModifyName(row) {
      if (row.edit) {
        updateBranch(row).then(response => {
          if (response.data.status === '0') {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '修改失败，稍后再试！',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(err => {
          this.$message.error(err)
        })
      }
      row.edit = !row.edit
    },
    create() {
      var isSame = this.list.some((item) => {
        return item.branchName.toLowerCase() === this.temp.branchName.toLowerCase()
      })
      if (isSame) {
        this.$message.error('该品牌名已存在！')
        return
      }
      if (!this.temp.branchName.trim()) {
        this.$message.error('品牌名不能为空！')
        return
      }
      addBranch(this.temp).then(response => {
        if (response.data.status === '0') {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        } else {
          this.$notify({
            title: '失败',
            message: '创建失败，稍后再试！',
            type: 'error',
            duration: 2000
          })
        }
      }).catch(err => {
        this.$message.error(err)
      })
      this.dialogFormVisible = false
    },
    handleCreate() {
      this.temp.branchName = ''
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    sortBranch() {
      this.listQuery.sort = -this.listQuery.sort
      this.getList()
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    }
  }
}
</script>
