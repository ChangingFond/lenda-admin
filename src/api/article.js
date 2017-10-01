import fetch from '@/utils/fetch'

export function fetchProduct(query) {
  return fetch({
    url: '/product',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return fetch({
    url: '/article/detail',
    method: 'get',
    params: query
  })
}

export function fetchBranch(query) {
  return fetch({
    url: '/branch',
    method: 'get',
    params: query
  })
}

export function fetchCategory(query) {
  return fetch({
    url: '/category',
    method: 'get',
    params: query
  })
}

export function addProduct(product) {
  return fetch({
    url: '/product/add',
    method: 'post',
    data: product
  })
}

export function addBranch(branch) {
  return fetch({
    url: '/branch/add',
    method: 'post',
    data: branch
  })
}

export function addCategory(category) {
  return fetch({
    url: '/category/add',
    method: 'post',
    data: category
  })
}

export function updateProduct(product) {
  return fetch({
    url: '/product/update',
    method: 'post',
    data: product
  })
}

export function updateBranch(branch) {
  return fetch({
    url: '/branch/update',
    method: 'post',
    data: branch
  })
}

export function updateCategory(category) {
  return fetch({
    url: '/category/update',
    method: 'post',
    data: category
  })
}
