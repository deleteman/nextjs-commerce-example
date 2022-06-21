import { GET_PRODUCTS, PRODUCTS_ERROR } from '../types'

const initialState = {
  makeUpProducts: [],
  loading: true,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        makeUpProducts: action.payload,
        loading: false,
      }
    case PRODUCTS_ERROR:
      return {
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}
