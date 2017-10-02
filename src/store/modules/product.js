const product = {
  state: {
    category: [],
    branch: []
  },

  mutations: {
    SET_BRANCH: (state, branch) => {
      state.branch.push(branch)
    },
    SET_CATEGORY: (state, category) => {
      state.category.push(category)
    }
  }
}

export default product
