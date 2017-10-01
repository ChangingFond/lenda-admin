<template>
  <el-row class="form-container">

    <el-col :span="14" :offset="5">
      <el-form label-width="75px" :model="postForm" :rules="rules" ref="postForm">
        <el-col :span="12">
        <el-form-item label="汽车品牌:" prop="branch">
          <el-select v-model="postForm.branch" filterable clearable placeholder="请选择，可输入搜索">
            <el-option v-for="item in branchList" :key="item._id" :label="item.branchName" :value="item.branchName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品分类:" prop="category">
          <el-select v-model="postForm.category" filterable clearable placeholder="请选择，可输入搜索">
            <el-option v-for="item in categoryList" :key="item._id" :label="item.categoryName" :value="item.categoryName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品型号:" class="postInfo-container-item" prop="productName">
          <el-input placeholder="请输入产品型号" v-model="postForm.productName">
          </el-input>
        </el-form-item>

        <el-form-item style="margin-bottom: 20px;" label="产品详情:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入产品介绍" v-model="postForm.productDetail">
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>

        <el-form-item>
          <el-button v-loading="loading" type="primary" @click="submitForm()">发布
          </el-button>
        </el-form-item>
      </el-col>

      <el-col :span="11" :offset="1">
        <div class="upload-container" style="margin-bottom: 20px;">
          <el-upload class="image-uploader" ref="upload"
          drag action="http://localhost:3000/upload/"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="true"
          list-type="picture">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将产品图片文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip" align="center">只能上传jpg文件，且不超过 2M</div>
        </el-upload>
      </div>
    </el-col>

    </el-form>
  </el-col>
</el-row>

</template>

<script>
// import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchBranch, fetchCategory, addProduct } from '@/api/article'

export default {
  name: 'addProduct',
  // components: { Sticky },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '请填充所有项',
          type: 'error',
          duration: 1 * 1000
        })
        callback(null)
      } else {
        callback()
      }
    }
    return {
      postForm: {
        branch: '', // 产品品牌
        category: '', // 产品分类
        dateTime: '', // 发布时间
        productDetail: '', // 产品详情
        productImage: '', // 产品图片
        productName: '' // 文章外部作者
      },
      fileList: [],
      branchList: [],
      categoryList: [],
      loading: false,
      rules: {
        branch: [{ validator: validateRequire }],
        category: [{ validator: validateRequire }],
        productName: [{ validator: validateRequire }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.productDetail.length
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleSuccess(res, file) {
      console.log(this.$refs.upload)
      if (res.status === '0') {
        this.postForm.productImage = res.result
      } else {
        this.$message.error(res.msg)
        this.$refs.upload.clearFiles()
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleRemove(file) {
      this.postForm.productImage = ''
    },
    handleError(err, file) {
      this.$message.error(err)
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    fetchData() {
      fetchBranch().then(response => {
        this.branchList = response.data.result.items
      }).catch(err => {
        console.log(err)
      })
      fetchCategory().then(response => {
        this.categoryList = response.data.result
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          // this.$refs.upload.submit()
          // this.loading = true
          this.postForm.status = 1
          this.postForm.dateTime = Date.now()  // .toLocaleDateString()
          this.postForm.letter = this.postForm.branch.substr(0, 1)
          addProduct(this.postForm).then(response => {
            if (response.data.status === '0') {
              this.$notify({
                title: '成功',
                message: '发布产品成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '发布产品失败，稍后再试！',
                type: 'error',
                duration: 2000
              })
            }
          }).catch(err => {
            console.log(err)
          })
          // this.loading = false
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.word-counter {
  width: 50px;
  position: absolute;
  right: -8px;
  top: 0px;
}

.form-container {
  width: 100%;
  min-width: 600px;
  padding: 100px 45px 20px 50px;
}
</style>
