import { Col, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
import DefaultLayout from "./../components/DefaultLayout";
import "../styles/Homepage.css"; // Import the CSS file for styling

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" });
        const { data } = await axios.get("http://localhost:4001/api/items/get-item");
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log("Error fetching items:", error);
      }
    };

    const getAllCategories = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" });
        const { data } = await axios.get("http://localhost:4001/api/categories/get-categories");
        console.log("Fetched categories:", data); // Debug log
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].name); // Set the first category as default selected
        }
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    getAllItems();
    getAllCategories();
  }, [dispatch]);

  useEffect(() => {
    console.log("Categories updated:", categories); // Debug log
    console.log("Selected category:", selectedCategory); // Debug log
  }, [categories, selectedCategory]);

  return (
    <DefaultLayout>
      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category._id} // Use _id as the key
            className={`category-box ${
              selectedCategory === category.code ? "category-active" : ""
            }`}
            onClick={() => setSelectedCategory(category.code)}
          >
            <h4 className="category-name">{category.name}</h4>
          </div>
        ))}
      </div>
      <Row gutter={[16, 16]}>
        {itemsData
          .filter((i) => i.category === selectedCategory)
          .map((item) => (
            <Col xs={24} lg={5} md={12} sm={24} key={item._id}>
              <ItemList item={item} />
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;
