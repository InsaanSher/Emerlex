import {
  CopyOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/DefaultLayout.css";
import Spinner from "./Spinner";
import Logo from "../assets/logo.png";
import SmallLogo from "../assets/smalllogo.png";

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout className="full-layout">
      {loading && <Spinner />}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="sider-content">
          <div className="logo-container">
            <img className="logo" src={collapsed ? SmallLogo : Logo} alt="Logo" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[window.location.pathname]}
          >
            <Menu.Item
              key="/"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
            >
              Home
            </Menu.Item>
            <Menu.Item
              key="/bills"
              icon={<CopyOutlined />}
              onClick={() => navigate("/bills")}
            >
              Bills
            </Menu.Item>
            <Menu.Item
              key="/items"
              icon={<UnorderedListOutlined />}
              onClick={() => navigate("/items")}
            >
              Items
            </Menu.Item>
            <Menu.Item
              key="/categories"
              icon={<AppstoreOutlined />}
              onClick={() => navigate("/categories")}
            >
              Categories
            </Menu.Item>
            <Menu.Item
              key="/customers"
              icon={<UserOutlined />}
              onClick={() => navigate("/customers")}
            >
              Customers
            </Menu.Item>
          </Menu>
          <Menu theme="dark" mode="inline" className="logout-menu">
            <Menu.Item
              key="/logout"
              icon={<LogoutOutlined />}
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/login");
              }}
            >
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            margin: 8,
            padding: 12,
            borderRadius: 8,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <div
            className="cart-item d-flex justify-content-between align-items-center"
            onClick={() => navigate("/cart")}
          >
            <p>{cartItems.length}</p>
            <ShoppingCartOutlined />
          </div>
        </Header>
        <Content className="content">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
