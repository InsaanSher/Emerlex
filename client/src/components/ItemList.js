import { Button, Card } from "antd";
import React from "react";
import { useDispatch } from "react-redux";

const ItemList = ({ item }) => {
  const dispatch = useDispatch();

  // Update cart handler
  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
  };

  const { Meta } = Card;

  return (
    <div className="item-box">
      <Card
        hoverable
        cover={<img alt={item.name} src={item.image} className="item-image" />}
      >
        <Meta title={item.name} className="item-meta" />
        <div className="item-button">
          <Button type="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
