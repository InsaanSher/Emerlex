import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Table, message, Upload } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Import storage

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [itemCode, setItemCode] = useState("");
  const [form] = Form.useForm();

  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const itemsResponse = await axios.get("http://localhost:4001/api/items/get-item");
      const categoriesResponse = await axios.get("http://localhost:4001/api/categories/get-categories");
      setItemsData(itemsResponse.data);
      setCategories(categoriesResponse.data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("http://localhost:4001/api/items/delete-item", { itemId: record._id });
      message.success("Item Deleted Successfully");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  const columns = [
    { title: "Item Code", dataIndex: "itemCode" },
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "Price", dataIndex: "price" },
    
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
              setItemCode(record.itemCode); // Set the item code for editing
              form.setFieldsValue({
                itemCode: record.itemCode,
              });
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  const handleUpload = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleSubmit = async (value) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      let imageUrl = value.image;
      if (fileList.length > 0) {
        imageUrl = await handleUpload(fileList[0]);
      }

      const payload = {
        ...value,
        image: imageUrl,
        itemCode, // Include itemCode in the payload
      };

      if (editItem === null) {
        await axios.post("http://localhost:4001/api/items/add-item", payload);
        message.success("Item Added Successfully");
      } else {
        await axios.put("http://localhost:4001/api/items/edit-item", {
          ...payload,
          itemId: editItem._id,
        });
        message.success("Item Updated Successfully");
      }

      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  const generateItemCode = async (categoryCode) => {
    try {
      const response = await axios.get("http://localhost:4001/api/items/get-item");
      const items = response.data.filter(item => item.category === categoryCode);
      const itemCount = items.length + 1;
      const newItemCode = `${categoryCode.toUpperCase()}${String(itemCount).padStart(4, '0')}`;
      setItemCode(newItemCode);
      form.setFieldsValue({
        itemCode: newItemCode,
      });
    } catch (error) {
      console.log("Error generating item code:", error);
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Item List</h1>
        <div>
          <Button type="primary" onClick={() => setPopupModal(true)} style={{ marginRight: '10px' }}>
            Add Item
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item " : "Add New Item"}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
            form.resetFields();
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            form={form}
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="itemCode"
              label="Item Code"
            >
              <Input value={itemCode} readOnly />
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please enter a price" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select onChange={(value) => generateItemCode(value)}>
                {categories.map((category) => (
                  <Select.Option key={category._id} value={category.code}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            

            <Form.Item
              name="upload"
              label="Upload Image"
            >
              <Upload
                beforeUpload={(file) => {
                  setFileList([file]);
                  return false;
                }}
                fileList={fileList}
                onRemove={() => setFileList([])}
              >
                <Button>Upload</Button>
              </Upload>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
