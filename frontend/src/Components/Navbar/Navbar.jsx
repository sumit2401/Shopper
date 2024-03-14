import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import drop_down_icon from "../Assets/drop-down-list.png";
const Navbar = () => {
  const [menu, setmenu] = useState("home");
  const { getTotalCartitems } = useContext(ShopContext);
  const menuref = useRef();
  const dropDown_toggle = (e) => {
    menuref.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };
  return (
    <div className="navbar">
      <div className="nav_logo">
        <img src={logo} alt="logo" />
        <p>Shopify</p>
      </div>
      <img
        className="nav-dropdown"
        onClick={dropDown_toggle}
        src={drop_down_icon}
        alt=""
      />
      <ul ref={menuref} className="nav-menu">
        <li
          onClick={() => {
            setmenu("home");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/">
            Home
          </Link>{" "}
          {menu === "home" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setmenu("mens");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/mens">
            Men
          </Link>{" "}
          {menu === "mens" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setmenu("womens");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/womens">
            Women
          </Link>{" "}
          {menu === "womens" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setmenu("kids");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/kids">
            Kid
          </Link>{" "}
          {menu === "kids" ? <hr /> : <></>}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button> : <Link style={{ textDecoration: "none" }} to="/login">
          <button>Login</button>
        </Link>}

        <Link to="/cart">
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartitems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
