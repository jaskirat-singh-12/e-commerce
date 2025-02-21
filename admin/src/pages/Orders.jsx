import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error('Error updating order status');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Function to generate and download invoice PDF
  const generateInvoicePDF = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice', 90, 15);
    
    doc.setFontSize(12);
    doc.text(`Customer Name: ${order.address.firstName} ${order.address.lastName}`, 15, 30);
    doc.text(`Address: ${order.address.street}, ${order.address.city}, ${order.address.state}`, 15, 40);
    doc.text(`Country: ${order.address.country}, ZIP: ${order.address.zipcode}`, 15, 50);
    doc.text(`Phone: ${order.address.phone}`, 15, 60);
    doc.text(`Payment Method: ${order.paymentMethod}`, 15, 70);
    doc.text(`Payment Status: ${order.payment ? 'Done' : 'Pending'}`, 15, 80);
    doc.text(`Order Date: ${new Date(order.date).toLocaleDateString()}`, 15, 90);

    // Table without Size Column
    doc.autoTable({
      startY: 100,
      head: [['Item', 'Quantity', 'Price']],
      body: order.items.map((item) => [item.name, item.quantity, `${currency}${item.price}`]),
    });
    
    doc.text(`Total Amount: ${currency}${order.amount}`, 15, doc.lastAutoTable.finalY + 10);

    doc.save(`Invoice_${order.address.firstName}.pdf`);
  };

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            key={index}
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'
          >
            <img className='w-12' src={assets.parcel_icon} alt='' />
            <div>
              <div>
                {order.items.map((item, index) => (
                  <p className='py-0.5' key={index}>
                    {item.name} x {item.quantity}
                  </p>
                ))}
              </div>
              <p className='mt-3 mb-2 font-medium'>
                {order.address.firstName} {order.address.lastName}
              </p>
              <div>
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
              <p className='mt-3'>Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className='text-sm sm:text-[15px]'>
              {currency}
              {order.amount}
            </p>
            
            {/* Order Status Dropdown */}
            <div>
              <select 
                onChange={(event) => statusHandler(event, order._id)} 
                value={order.status} 
                className='p-2 font-semibold w-full'
              >
                <option value='Order Placed'>Order Placed</option>
                <option value='Packing'>Packing</option>
                <option value='Shipped'>Shipped</option>
                <option value='Out for delivery'>Out for delivery</option>
                <option value='Delivered'>Delivered</option>
              </select>

              {/* Download Invoice Button Below */}
              <button
                  type="button"
                  onClick={() => generateInvoicePDF(order)}
                  className="bg-white text-black px-5 py-3 text-sm border-2 border-gray-200 rounded-md"
                >
                  <i className='fa-regular fa-download'></i> Download Invoice
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
