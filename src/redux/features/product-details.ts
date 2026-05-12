
import { createSlice } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    title: "",
    reviews: 0,
    price: 0,
    discountedPrice: 0,
    images: [], //  keep this if Product has images
    id: 0,
    imgs: { thumbnails: [], previews: [] }, //  correct field
    category: "", // optional, can be omitted if you prefer
  },
};

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;
