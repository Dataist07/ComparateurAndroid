import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        cart:[],
    },
    reducers:{
        addToCart : (state,action) => {
            const itemInCart = state.cart.find((item) => item.id == action.payload.id);
            if(itemInCart){
                itemInCart.quantity++;
            }else{
                state.cart.push({...action.payload,quantity:1})
            }
        },
        removeFromCart : (state,action) => {
            const removeFromCart = state.cart.filter((item) => item.id !== action.payload.id);
            state.cart = removeFromCart;
        },
        incrementQuantity : (state,action) => {
            const itemInCart = state.cart.find((item) => item.id == action.payload.id);
            itemInCart.quantity++;
        },
        decrementQuantity : (state,action) => {
            const itemInCart = state.cart.find((item) => item.id == action.payload.id);
            if(itemInCart.quantity == 1){
                const removeFromCart = state.cart.filter((item) => item.id !== action.payload.id);
                state.cart = removeFromCart;
            }else{
                itemInCart.quantity--;
            }

        },
        deleteCart: (state, action) => {
            const removeFromCart = state.cart.filter(
              (item) => item.supermarket !== action.payload
            );
            state.cart = removeFromCart;
        },
        
        deleteAllCart: (state) => {
            state.cart = []; // Set the cart state to an empty array
        },
        
        replaceCart: (state, action) => {
            state.cart = action.payload; // Replace the current cart state with the new state
        },
    }
});


export const {addToCart,removeFromCart,incrementQuantity,decrementQuantity,deleteCart,deleteAllCart,replaceCart} = cartSlice.actions;

const cartReducer = cartSlice.reducer;

export default cartReducer;