import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

// for cart
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItem, setCartItem] = useState(getDefaultCart());

  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((response) => response.json())
      .then((data) => setAll_Product(data));

    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/getcart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        }
        , body: "",
      }).then((response) => response.json())
        .then((data) => setCartItem(data))
    }
  }, []);


  //add to cart
  const addToCart = (itemId) => {
    setCartItem((previous) => ({
      ...previous,
      [itemId]: previous[itemId] + 1,
    }));
    if (localStorage.getItem('auth-token')) { //if this that means we are login in
      fetch('http://localhost:4000/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "itemId": itemId }),

      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  //subtract from cart
  const subtractFromCart = (itemId) => {
    setCartItem((previous) => ({
      ...previous,
      [itemId]: previous[itemId] - 1,
    }));
  };

  //remove from cart
  const removeFromCart = (itemId) => {
    setCartItem((previous) => ({ ...previous, [itemId]: 0 }));
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "itemId": itemId }),

      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  //get total amount by multiplying quantity with product
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItem[item];
      }
    }
    return totalAmount;
  };

  //cart item number
  const getTotalCartitems = () => {
    let totaItem = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        totaItem += cartItem[item];
        if (cartItem[item] >= 20) {
          return "20+";
        }
      }
    }
    return totaItem;
  };

  //passing value in context as props--- using this context we can use all_product and cartItem in any component
  const contextValue = {
    all_product,
    cartItem,
    addToCart,
    subtractFromCart,
    getTotalCartAmount,
    removeFromCart,
    getTotalCartitems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
