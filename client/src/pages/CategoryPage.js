import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, message, Table, Upload, Progress } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const getAllCategories = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const categoriesResponse = await axios.get("http://localhost:4001/api/categories/get-categories");
      setCategories(categoriesResponse.data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
    //eslint-disable-next-line
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.delete(`http://localhost:4001/api/categories/delete-category/${record._id}`);
      message.success("Category Deleted Successfully");
      getAllCategories();
      setCategoryModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };


  const handleSubmit = async (value) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
  
      // Remove FormData and directly use the form values
      const { name, code } = value;
  
      const payload = { name, code };
  
      await axios.post("http://localhost:4001/api/categories/add-category", payload);
      
      message.success("Category Added Successfully");
      
      getAllCategories();
      setCategoryModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };
  
  const columns = [
    { title: "Category Code", dataIndex: "code" },
    { title: "Category Name", dataIndex: "name" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer", marginRight: 12 }}
            onClick={() => {
              setEditCategory(record);
              setCategoryModal(true);
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

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Category List</h1>
        <div>
          <Button type="primary" onClick={() => setCategoryModal(true)} style={{ marginRight: '10px' }}>
            Add Category
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={categories} bordered />

      {categoryModal && (
        <Modal
          title={`${editCategory !== null ? "Edit Category " : "Add New Category"}`}
          visible={categoryModal}
          onCancel={() => {
            setEditCategory(null);
            setCategoryModal(false);
          }}
          footer={false}
        >
          <Form
  layout="vertical"
  onFinish={handleSubmit}
  initialValues={editCategory || { name: '', code: '' }}
>
  <Form.Item
    name="name"
    label="Name"
    rules={[{ required: true, message: "Please enter a name" }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="code"
    label="Code"
    rules={[{ required: true, message: "Please enter a code" }]}
  >
    <Input />
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

export default CategoryPage;
