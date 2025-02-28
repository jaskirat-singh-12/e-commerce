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

  const generateInvoicePDF = (order) => {
    const doc = new jsPDF();
  
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('PURCHASE ORDER', 15, 20);
  
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Mwing.com', 15, 35);
    doc.setFont('helvetica', 'normal');
    doc.text('xyz', 15, 42);
    doc.text('Delhi, Delhi 400077', 15, 49);
  
    doc.setFont('helvetica', 'bold');
    doc.text('VENDOR', 15, 60);
    doc.setFont('helvetica', 'normal');
    doc.text('Mwings', 15, 67);
    doc.text('Delhi sec-23 Rohini', 15, 74);

    doc.setFont('helvetica', 'bold');
    doc.text('SHIP TO', 100, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.address.firstName} ${order.address.lastName}`, 100, 67);
    doc.text(`${order.address.street}, ${order.address.city}`, 100, 74);
    doc.text(`${order.address.state}, ${order.address.zipcode}`, 100, 81);
  
    doc.setFont('helvetica', 'bold');
    // doc.text('ORDER #', 170, 60);
    doc.text('ORDER DATE', 170, 74);
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.orderId}`, 170, 67);
    doc.text(`${new Date(order.date).toLocaleDateString()}`, 170, 81);
  
    doc.autoTable({
      startY: 100,
      head: [['QTY', 'DESCRIPTION', 'UNIT PRICE', 'AMOUNT']],
      body: order.items.map((item) => [
        item.quantity,
        item.name,
        `${currency}${item.price}`,
        `${currency}${item.quantity * item.price}`,
      ]),
      headStyles: { fillColor: [44, 62, 80] },
    });
  
    let finalY = doc.lastAutoTable.finalY + 10;
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Subtotal : ${currency}${order.amount.toFixed(2)}`, 140, finalY);
    doc.text(`GST 12% : ${currency}${(order.amount * 0.12).toFixed(2)}`, 140, finalY + 10);
    doc.text(`TOTAL : ${currency}${(order.amount * 1.12).toFixed(2)}`, 140, finalY + 20);
  
    doc.setFontSize(10);
    doc.text('TERMS & CONDITIONS', 15, finalY + 40);
    doc.setFont('helvetica', 'normal');
    doc.text('Payment is due within 15 days.', 15, finalY + 48);
    doc.text('State Bank of India', 15, finalY + 56);
    doc.text(`Account Number: 123456789`, 15, finalY + 64);

    doc.setFont('helvetica', 'bold');
    doc.text('_________________', 150, finalY + 60);
    doc.text('Mwings', 160, finalY + 70);
  
    doc.save(`Invoice of ${order.address.firstName}.pdf`);
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
                  <i className='fa-regular fa-download'></i>Download Invoice
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
