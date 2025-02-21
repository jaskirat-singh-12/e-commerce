import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
              address: order.address, 
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const generatePDF = (item) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Invoice', 15, 20);

    if (item.address) {
      doc.setFontSize(12);
      doc.text(`Customer Name: ${item.address.firstName} ${item.address.lastName}`, 15, 30);
      doc.text(`Address: ${item.address.street}, ${item.address.city}, ${item.address.state}`, 15, 40);
      doc.text(`Country: ${item.address.country}, ZIP: ${item.address.zipcode}`, 15, 50);
      doc.text(`Phone: ${item.address.phone}`, 15, 60);
    }

    doc.text(`Payment Method: ${item.paymentMethod}`, 15, 70);
    doc.text(`Payment Status: ${item.payment ? 'Done' : 'Pending'}`, 15, 80);
    doc.text(`Order Date: ${new Date(item.date).toLocaleDateString()}`, 15, 90);

    // Product Details Table
    doc.autoTable({
      startY: 100,
      head: [['Product Name', 'Quantity', 'Price', 'Total']],
      body: [
        [item.name, item.quantity, `${currency}${item.price}`, `${currency}${(item.quantity * item.price).toFixed(2)}`],
      ],
      theme: 'striped',
    });

    // Grand Total
    doc.text(`Grand Total: ${currency}${(item.quantity * item.price).toFixed(2)}`, 15, doc.lastAutoTable.finalY + 15);

    doc.save(`Invoice_${item.address.firstName}.pdf`);
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.length > 0 ? (
          orderData.map((item, index) => (
            <div key={index} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20" src={item.image[0]} alt={item.name} />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <p className="mt-1">Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span></p>
                  <p className="mt-1">Payment: <span className="text-gray-400">{item.paymentMethod}</span></p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button onClick={loadOrderData} className="border px-4 py-2 text-sm font-medium rounded-sm">Track Order</button>
                <button
                  type="button"
                  onClick={() => generatePDF(item)}
                  className="bg-white text-black px-5 py-3 text-sm border-2 border-gray-200 rounded-md"
                >
                  {/* <FontAwesomeIcon icon={faFileArrowDown} /> */}
                  Download Invoice
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
