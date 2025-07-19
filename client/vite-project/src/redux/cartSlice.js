import {createSlice} from "@reduxjs/toolkit";
const initialState ={
    cartItems:[],
    totalItems:0,
    totalPrice:0,
};

const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart(state,action){
            const product = action.payload;
            const existingItem =state.cartItems.find(item=> item.id === product.id);
        if(existingItem){
             existingItem.quantity += 1;
        }
        else{
            state.cartItems.push({...product,quantity:1});
        }
        state.totalItems += 1;
        state.totalPrice += product.price;

        },

     removeFromCart(state, action) {
      const id = action.payload;
      const item = state.cartItems.find(item => item.id === id);

      if (item) {
        state.totalItems -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        state.cartItems = state.cartItems.filter(item => item.id !== id);
      }
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
},
})
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;