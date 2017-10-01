<template>
  <div class="app-container calendar-list-container" style="width: 50%;margin-left: 25%">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="支持模糊搜索" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="setting" @click="handleReset">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row>

      <el-table-column align="center" label="编号" width="280">
        <template scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="260px" label="品牌名称">
        <template scope="scope">
          <el-input @keyup.enter.native="handleModifyName(scope.row)" v-show="scope.row.edit" size="small" v-model="scope.row.categoryName"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.categoryName }}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="tiny">
      <el-form class="small-space" :model="temp" label-position="top" label-width="70px">
        <el-form-item label="分类名称" placeholder="请输入产品分类名称">
          <el-input v-model="temp.categoryName"></el-input>
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
import { fetchCategory, addCategory, updateCategory } from '@/api/article'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'category',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        categoryName: ''
      },
      listQuery: {
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
      fetchCategory(this.listQuery).then(response => {
        const items = response.data.result
        this.list = items.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.listLoading = false
      })
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
        updateCategory(row).then(response => {
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
      // this.temp._id = parseInt(Math.random() * 100) + 1024
      // this.temp.categoryName = '原创作者'
      // this.list.unshift(this.temp)
      addCategory(this.temp).then(response => {
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
      this.temp.categoryName = ''
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
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
