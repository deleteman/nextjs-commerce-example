import create from 'zustand'

const productStore = null
export const useProductsStore = (logger) => {
  if (!productStore) {
    //use a singleton pattern to make sure we only create the store the first time around
    productStore = createProductStore(logger)
  }
  return productStore
}

function createProductStore(logger) {
  return create(
    logger((set) => ({
      products: [],
      addProduct: (p) =>
        set((state) => {
          const prodFound = state.products.find((prod) => {
            return p.id == prod.id
          })
          if (prodFound) {
            p.amount = prodFound.amount + 1
          } else {
            p.amount = 1
          }

          return {
            products: [...state.products.filter((prod) => p.id != prod.id), p],
          }
        }),
    }))
  )
}
