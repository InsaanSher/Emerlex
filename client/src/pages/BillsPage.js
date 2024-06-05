import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import DefaultLayout from "../components/DefaultLayout";
import "../styles/InvoiceStyles.css";
import Logo from "../assets/dark-logo.png";

const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  
  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("http://localhost:4001/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBills();
    // eslint-disable-next-line
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columns = [
    { title: "Invoice Number", dataIndex: "invoiceNumber" },
    { title: "Subtotal", dataIndex: "subTotal" },
    { title: "Total Amount", dataIndex: "totalAmount" },
    { title: "Payment Mode", dataIndex: "paymentMode" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  console.log(selectedBill);

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Invoice list</h1>
      </div>

      <Table columns={columns} dataSource={billsData} bordered />

      {popupModal && (
        <Modal
          width={500}
          pagination={false}
          title="Invoice Details"
          visible={popupModal}
          onCancel={() => setPopupModal(false)}
          footer={false}
        >
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              <div className="info">
                <img className="logo" src={Logo} alt="Logo" />
                <p>Contact: +94 77 163 6448<br />No 250, Hospital Junction, Eheliyagoda</p>
              </div>
            </center>
            <div id="mid">
              <div className="mt-2">
                <p>
                  Date: <b>{new Date(selectedBill.date).toLocaleDateString("en-GB")}</b><br />
                  Invoice Number: <b>{selectedBill.invoiceNumber}</b><br />
                </p>
              </div>
            </div>
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item table-header"><p><b>Item</b></p></td>
                      <td className="Hours table-header"><p><b>Qty</b></p></td>
                      <td className="Rate table-header"><p><b>Price</b></p></td>
                      <td className="Rate table-header"><p><b>Total</b></p></td>
                    </tr>
                    {selectedBill.cartItems.map((item) => (
                      <tr className="service" key={item._id}>
                        <td className="tableitem"><p className="itemtext">{item.name}</p></td>
                        <td className="tableitem"><p className="itemtext">{item.quantity}</p></td>
                        <td className="tableitem"><p className="itemtext">{item.price}</p></td>
                        <td className="tableitem"><p className="itemtext">{item.quantity * item.price}</p></td>
                      </tr>
                    ))}
                    <tr className="tabletitle">
                      <td colSpan="3" className="Rate table-header"><p className="grand-total-label"><b>Grand Total (Rs.)</b></p></td>
                      <td className="payment"><p className="grand-total-value"><b>{selectedBill.totalAmount}</b></p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div id="legalcopy">
                <p className="legal"><strong>Thank you for your order!</strong><br />
                  For any assistance please write email to <b>emerlexhaven@gmail.com</b> <br />
                  or <br />
                  call us <b>+94 77 163 6448</b>
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>Print</Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;
