import "./Addproduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useState } from "react";
const AddProduct = () => {
  const [image, setImage] = useState(false); //for handling the image in image input field
  const [productDetails, setProductDetails] = useState({
    //for fetching the data from input fields
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  //handeling image
  const imageHandler = (e) => {
    setImage(e.target.files[0]); //e= event(in this case imagehandler is a event handler ). target= triggering the element.. in this case file is the element we are triggering.
  };

  //handeling change in products
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value }); //using spread operator
  };

  const Add_Product = async () => {
    console.log(productDetails);

    //writtting the logic or sending the data into backend database


    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image);

    await fetch("http://localhost:4000/upload", {
      method: "POST",
      header: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });
    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch('http://localhost:4000/addproduct', {
        method: 'POST', //telling server to use post request in method
        headers: {
          Accept: 'application/json', //accepting json
          'Content-Type': 'application/json', //sending more json
        },
        body: JSON.stringify(product), //sending product details in json file
      }).then((resp) => resp.json()).then((data) => { // .then((resp) => resp.json()) means converting response into json
        data.success ? alert("Product Added") : alert("Failed") //turnery operator
      })
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler} // we give the function refrence that's why there is no brackets
            type="text"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p> Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          name="category"
          value={productDetails.category}
          onChange={changeHandler}
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button
        onClick={() => {
          Add_Product(); //in onClick we execute function that's why we pass the function with brackets
        }}
        className="addproduct-btn"
      >
        Add
      </button>
    </div>
  );
};

export default AddProduct;
