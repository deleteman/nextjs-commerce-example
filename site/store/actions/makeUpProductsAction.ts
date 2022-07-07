import { GET_PRODUCTS, PRODUCTS_ERROR } from "../types";
import axios from "axios";
import slugify from "slugify";

export const getMakeUpProducts = () =>
  async (dispatch: any) => {
    console.log("Getting the makeup products");

    try {
      let { data } = await axios.get(
        "https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline&apiKey=123fff132",
      );
      const products = data;

      let newProds = products.map((p: any) => {
        return {
          id: "" + p.id,
          slug: slugify(p.name),
          name: p.name,
          description: "",
          images: [{ url: p.image_link }],
          variants: [],
          price: {
            value: +p.price,
          },
          options: [],
        };
      });

      dispatch({
        type: GET_PRODUCTS,
        payload: newProds,
      });
    } catch (e) {
      dispatch({
        type: PRODUCTS_ERROR,
        payload: e,
      });
    }
  };
