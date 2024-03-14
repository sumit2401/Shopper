import React from "react";
import "./Relatedproducts.css";
import dataProduct from "../Assets/data";
import Item from "../Items/Item";
const RelatedProducts = () => {
  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="Item">
        {dataProduct.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
