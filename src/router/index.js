import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/',
    icon: 'example',
    noDropdown: true,
    children: [{ path: '', component: _import('dashboard/index'), name: 'Dashboard' }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  base: '/admin/',
  // mode: 'history', // 是否有'#', 默认mode: 'hash'
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   name: '权限测试',
  //   icon: 'lock',
  //   meta: { role: ['admin'] },
  //   noDropdown: true,
  //   children: [{ path: 'index', component: _import('permission/index'), name: '权限测试页', meta: { role: ['admin'] }}]
  // },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   icon: 'icon',
  //   noDropdown: true,
  //   children: [{ path: 'index', component: _import('svg-icons/index'), name: 'icons' }]
  // },
  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: '/components/index',
  //   name: '组件',
  //   icon: 'component',
  //   children: [
  //     { path: 'index', component: _import('components/index'), name: '介绍 ' },
  //     { path: 'tinymce', component: _import('components/tinymce'), name: '富文本编辑器' },
  //     { path: 'markdown', component: _import('components/markdown'), name: 'Markdown' },
  //     { path: 'jsoneditor', component: _import('components/jsonEditor'), name: 'JSON编辑器' },
  //     { path: 'dndlist', component: _import('components/dndList'), name: '列表拖拽' },
  //     { path: 'splitpane', component: _import('components/splitpane'), name: 'SplitPane' },
  //     { path: 'avatarupload', component: _import('components/avatarUpload'), name: '头像上传' },
  //     { path: 'dropzone', component: _import('components/dropzone'), name: 'Dropzone' },
  //     { path: 'sticky', component: _import('components/sticky'), name: 'Sticky' },
  //     { path: 'countto', component: _import('components/countTo'), name: 'CountTo' },
  //     { path: 'mixin', component: _import('components/mixin'), name: '小组件' },
  //     { path: 'backtotop', component: _import('components/backToTop'), name: '返回顶部' }
  //   ]
  // },
  {
    path: '/product',
    component: Layout,
    redirect: 'noredirect',
    icon: 'form',
    noDropdown: true,
    children: [
      { path: 'publish', component: _import('example/form'), name: '产品发布' }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: 'noredirect',
    icon: 'table',
    noDropdown: true,
    children: [
      { path: 'list', component: _import('example/table/table'), name: '产品列表' }
    ]
  },
  {
    path: '/branch',
    component: Layout,
    redirect: 'noredirect',
    icon: 'chart',
    noDropdown: true,
    children: [
      { path: '', component: _import('example/table/inlineEditTable'), name: '品牌列表' }
    ]
  },
  {
    path: '/category',
    component: Layout,
    redirect: 'noredirect',
    icon: 'component',
    noDropdown: true,
    children: [
      { path: '', component: _import('example/table/dragTable'), name: '产品分类' }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
