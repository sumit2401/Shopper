import React, { useEffect, useState } from "react";
import "./Popular.css";



import Item from "../Items/Item";
const Popular = () => {
  const [popularProducts, setPopularProducts] = useState({
    women: [],
    men: [],
    kids: [],
  });

  useEffect(() => {
    const fetchData = async (category) => {
      try {
        const response = await fetch(`http://localhost:4000/popularin${category}`);
        const data = await response.json();
        setPopularProducts((prevProducts) => ({ ...prevProducts, [category]: data }));
      } catch (error) {
        console.error(`Error fetching data for ${category}:`, error);
      }
    };

    fetchData("women");
    fetchData("men");
    fetchData("kids");
  }, []);

  return (
    <div className="popular">
      {/* Women section */}
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.women.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>

      {/* Men section */}
      <h1 className="men-heading">POPULAR IN MEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.men.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>

      {/* Kids section */}
      <h1 className="men-heading">POPULAR IN KID</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.kids.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;

