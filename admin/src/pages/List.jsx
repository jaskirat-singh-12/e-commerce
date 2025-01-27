import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [password, setPassword] = useState(""); // State for password input
  const [showPrompt, setShowPrompt] = useState(false); // State for showing the password prompt
  const [message, setMessage] = useState(""); // State for displaying messages
  const [messageColor, setMessageColor] = useState(""); // State for message color
  const [currentProductId, setCurrentProductId] = useState(null); // State for current product ID

  const correctPassword = "automobile123"; // Define the correct password

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    setShowPrompt(true);
    setCurrentProductId(id); // Store the current product ID to be deleted
  }

  const handleDelete = async () => {
    try {
      if (password === correctPassword) {
        const response = await axios.post(backendUrl + '/api/product/remove', { id: currentProductId }, { headers: { token } })
        toast.success(response.data.message)
        await fetchList();
        setMessage("Deletion confirmed. Action executed successfully.");
        setMessageColor("green");
      } else {
        setMessage("Incorrect password. Deletion canceled.");
        setMessageColor("red");
      }
      setPassword(""); // Clear the password field
      setShowPrompt(false); // Hide the prompt

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }

      </div>

      {/* Password Prompt */}
      {showPrompt && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              marginRight: "10px",
            }}
          />
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleDelete}
          >
            Confirm
          </button>
          <button className=" text-16px bg-red-500 text-white px-5 py-2.5 mx-2 rounded border-none border-radius-5px cursor-pointer m-10px "
            // style={{
            //   padding: "10px 20px",
            //   fontSize: "16px",
            //   backgroundColor: "#757575",
            //   color: "white",
            //   border: "none",
            //   borderRadius: "5px",
            //   cursor: "pointer",
            //   marginLeft: "10px",
            // }}
            onClick={() => setShowPrompt(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Message */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "18px",
          color: messageColor,
        }}
      >
        {message}
      </div>
    </>
  );
};

export default List;
