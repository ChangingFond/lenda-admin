import fetch from '@/utils/fetch'

export function fetchList(query) {
  return fetch({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle() {
  return fetch({
    url: '/article/detail',
    method: 'get'
  })
}

export function addProduct(product) {
  return fetch({
    url: '/product/add',
    method: 'post',
    data: product
  })
}

export function fetchProduct() {
  return fetch({
    url: '/product',
    method: 'get'
  })
}

export function fetchBranch() {
  return fetch({
    url: '/branch',
    method: 'get'
  })
}

export function fetchCategory() {
  return fetch({
    url: '/category',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return fetch({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}
