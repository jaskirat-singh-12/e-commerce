
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [password, setPassword] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [currentProductId, setCurrentProductId] = useState(null);
  const correctPassword = "automobile123";
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = (id) => {
    setShowPrompt(true);
    setCurrentProductId(id);
  };

  
  const handleDelete = async () => {
    try {
      if (password === correctPassword) {
        const response = await axios.post(
          backendUrl + `/api/product/remove`,
          { id: currentProductId },
          { headers: { token } }
        );
        toast.success(response.data.message);
        await fetchList();
        setMessage("Deletion confirmed. Action executed successfully.");
        setMessageColor("green");
      } else {
        setMessage("Incorrect password. Deletion canceled.");
        setMessageColor("red");
      }
      setPassword("automobile123");
      setShowPrompt(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item, index) => (
          <div
            className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'
            key={index}
          >
            <img className='w-12' src={item.image[0]} alt='' />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>
              X
            </p>
          </div>
        ))}
      </div>

      {/* Password Prompt Modal */}
      {showPrompt && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96 text-center'>
            <h2 className='text-lg font-bold mb-4'>Enter Password</h2>
            <input
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border p-2 w-full rounded mb-4'
            />
            <div className='flex justify-center gap-4'>
              <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={() => setShowPrompt(false)}>
                Cancel
              </button>
              <button className='bg-green-500 text-white px-4 py-2 rounded' onClick={handleDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className='mt-4 text-lg' style={{ color: messageColor }}>
          {message}
        </div>
      )}
    </>
  );
};

export default List;
