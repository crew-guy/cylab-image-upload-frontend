// src/store/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
    products: Array<{
        name: string;
        imageUrls: string[];
    }>;
}

const initialState: ProductState = {
    products: [],
};

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<{ name: string; imageUrls: string[] }>) => {
            state.products.push(action.payload);
        },
    },
});

export const { addProduct } = productSlice.actions;

export default productSlice.reducer;
