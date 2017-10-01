<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.category" placeholder="产品分类">
        <el-option v-for="item in categoryOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable filterable class="filter-item" style="width: 130px" v-model="listQuery.branch" placeholder="品牌">
        <el-option v-for="item in categoryOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="产品名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="setting" @click="handleReset">重置</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="loading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65" type="expand">
        <template scope="scope">
          <el-form label-position="center" inline class="demo-table-expand">
            <el-form-item label="产品名称">
              <span>{{ scope.row.productName }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ scope.row.category }}</span>
            </el-form-item>
            <el-form-item label="所属品牌">
              <span>{{ scope.row.branch }}</span>
            </el-form-item>
            <el-form-item label="图片地址">
              <a @click.prevent="handlePriview(scope.row.productImage)" href="#">点我看图</a>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ scope.row.productDetail }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column width="180" align="center" label="发布时间">
        <template scope="scope">
          <span>{{ scope.row.dateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300" label="产品名称">
        <template scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.productName }}</span>
          <!-- <el-tag>{{scope.row.type | typeFilter}}</el-tag> -->
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="分类">
        <template scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160" align="center" label="品牌">
        <template scope="scope">
          <span>{{ scope.row.branch }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="状态" width="95">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status === 1 ? '发布中': '已删除'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="scope.row.status!= 1" size="small" type="success" @click="handleModifyStatus(scope.row, 1)">发布
          </el-button>
          <el-button v-if="scope.row.status!= 0" size="small" type="danger" @click="handleModifyStatus(scope.row, 0)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container" align="right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-row style="margin-left:30px;">
        <el-col :span="12">
          <el-form class="small-space" :model="temp" label-position="left" label-width="70px">
            <el-form-item label="类型">
              <el-select class="filter-item" filterable clearable v-model="temp.category" placeholder="请选择">
                <el-option v-for="item in categoryOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="品牌">
              <el-select class="filter-item" filterable clearable v-model="temp.branch" placeholder="请选择">
                <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="产品名称" placeholder="请输入产品名称">
              <el-input v-model="temp.productName"></el-input>
            </el-form-item>

            <el-form-item label="产品详情">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入产品详情" v-model="temp.productDetail">
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-upload class="image-uploader" ref="upload"
            drag action="http://localhost:3000/upload/"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="true">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将产品图片拖至此处进行替换，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" align="center">只能上传jpg文件，且不超过 2M</div>
          </el-upload>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="dialogImgVisible" size="small">
      <img class="pan-img" :src="ewizardClap" alt="图片找不到啦">
    </el-dialog>

  </div>
</template>

<script>
import { fetchProduct, updateProduct } from '@/api/article'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'

const categoryOptions = [
  { key: 'Radiator', display_name: 'Radiator' },
  { key: 'Intercooler', display_name: 'Intercooler' },
  { key: 'Engine', display_name: 'Engine' },
  { key: 'Other', display_name: 'Other' }
]

// arr to obj
// const categoryTypeKeyValue = categoryOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'table_product',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        category: undefined,
        branch: undefined,
        status: undefined
      },
      temp: {
        // _id: '',
        // branch: '',
        // productName: '',
        // category: '',
        // productDetail: '',
        // status: undefined
      },
      categoryOptions,
      statusOptions: [
        { key: 1, display_name: '发布中' },
        { key: 0, display_name: '已删除' }
      ],
      fileList: [],
      dialogFormVisible: false,
      dialogStatus: '',
      dialogImgVisible: false,
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
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
      fetchProduct(this.listQuery).then(response => {
        var result = response.data.result
        this.list = result.items
        this.total = result.total
        this.listLoading = false
      })
    },
    handleSuccess(res, file) {
      if (res.status === '0') {
        this.temp.productImage = res.result
      } else {
        this.$message.error(res.msg)
        this.$refs.upload.clearFiles()
      }
    },
    handleError(err, file) {
      this.$message.error(err)
    },
    handleRemove(file) {
      this.temp.productImage = ''
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      // const isOne = this.fileList.length === 1
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      // if (!isOne) {
      //   this.$message.error('只允许上传 1 张图片！')
      // }
      return isJPG && isLt2M
    },
    handlePriview(src) {
      this.dialogImgVisible = true
      this.ewizardClap = src
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.resetQuery()
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      row.status = status
      updateProduct(row).then(response => {
        if (response.data.status === '0') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '操作失败，稍后再试！',
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    update() {
      console.log(this.temp)
      updateProduct(this.temp).then(response => {
        if (response.data.status === '0') {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          for (const v of this.list) {
            if (v._id === this.temp._id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
        } else {
          this.$notify({
            title: '失败',
            message: '更新失败，稍后再试！',
            type: 'error',
            duration: 2000
          })
        }
      }).catch(err => {
        this.$message.error(err)
      })
      this.dialogFormVisible = false
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 0,
        remark: '',
        timestamp: 0,
        title: '',
        status: '发布中',
        type: ''
      }
    },
    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        name: undefined,
        category: undefined,
        branch: undefined,
        status: undefined
      }
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = ['时间', '产品名称', '产品分类', '所属品牌', '产品详情']
        const filterVal = ['timestamp', 'productName', 'category', 'branch', 'productDetail']
        const data = this.formatJson(filterVal, this.list)
        export_json_to_excel(tHeader, data, '产品数据一览')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
