// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import { assets } from '../assets/assets';
// import Title from '../components/Title';
// import ProductItem from '../components/ProductItem';

// const Collection = () => {
//   const { products, search, showSearch } = useContext(ShopContext);
//   const [filterProducts, setFilterProducts] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [subCategory, setSubCategory] = useState([]);
//   const [sortType, setSortType] = useState('relavent');

//   const toggleCategory = (e) => {
//     if (category.includes(e.target.value)) {
//       setCategory((prev) => prev.filter((item) => item !== e.target.value));
//     } else {
//       setCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const toggleSubCategory = (e) => {
//     if (subCategory.includes(e.target.value)) {
//       setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
//     } else {
//       setSubCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   // Apply Filters
//   const applyFilter = () => {
//     let productsCopy = [...products];

//     // Search Filter
//     if (showSearch && search) {
//       productsCopy = productsCopy.filter((item) =>
//         item.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (category.length > 0) {
//       productsCopy = productsCopy.filter((item) => category.includes(item.category));
//     }

//     if (subCategory.length > 0) {
//       productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
//     }

//     setFilterProducts(productsCopy);
//   };

//   const sortProduct = () => {
//     let sortedProducts = [...filterProducts];

//     switch (sortType) {
//       case 'low-high':
//         sortedProducts.sort((a, b) => a.price - b.price);
//         break;
//       case 'high-low':
//         sortedProducts.sort((a, b) => b.price - a.price);
//         break;
//       default:
//         applyFilter();
//         return;
//     }

//     setFilterProducts(sortedProducts);
//   };

//   useEffect(() => {
//     applyFilter();
//   }, [category, subCategory, search, showSearch, products]);

//   useEffect(() => {
//     sortProduct();
//   }, [sortType]);

//   return (
//     <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
//       {/* Sidebar Filters */}
//       <div className='min-w-60'>
//         <p className='my-2 text-xl flex items-center cursor-pointer gap-2'>
//           FILTERS
//         </p>

//         {/* Category Filter */}
//         <div className='border border-gray-300 pl-5 py-3 mt-6'>
//           <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
//           <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
//             <p className='flex gap-2'>
//               <input className='w-3' type="checkbox" value={'Car'} onChange={toggleCategory} /> Car
//             </p>
//             <p className='flex gap-2'>
//               <input className='w-3' type="checkbox" value={'Bike'} onChange={toggleCategory} /> Bike
//             </p>
//             <p className='flex gap-2'>
//               <input className='w-3' type="checkbox" value={'Scooty'} onChange={toggleCategory} /> Scooty
//             </p>
//           </div>
//         </div>

//         {/* Subcategory Filter */}
//         <div className='border border-gray-300 pl-5 py-3 my-5'>
//           <p className='mb-3 text-sm font-medium'>TYPE</p>
//           <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
//             <p className='flex gap-2'>
//               <input className='w-3' type="checkbox" value={'Universal for Car'} onChange={toggleSubCategory} /> Universal for Car
//             </p>
//             <p className='flex gap-2'>
//               <input className='w-3' type="checkbox" value={'Universal for Bike'} onChange={toggleSubCategory} /> Universal for Bike
//             </p>
//             <p className='flex gap-2'>
//               <input className='w-3' type="checkbox" value={'Universal for Scooty'} onChange={toggleSubCategory} /> Universal for Scooty
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Right Side (Product List) */}
//       <div className='flex-1'>
//         <div className='flex justify-between text-base sm:text-2xl mb-4'>
//           <Title text1={'ALL'} text2={'COLLECTIONS'} />
//           {/* Product Sort */}
//           <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
//             <option value="relavent">Sort by: Relevant</option>
//             <option value="low-high">Sort by: Low to High</option>
//             <option value="high-low">Sort by: High to Low</option>
//           </select>
//         </div>

//         {/* Product Grid */}
//         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
//           {filterProducts.length > 0 ? (
//             filterProducts.map((item, index) => (
//               <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
//             ))
//           ) : (
//             <p className='text-gray-500'>No products found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;


import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  // Define category to subcategory mapping
  const categoryToSubCategories = {
    Bike: ["Universal for bike", "hdv", "..."],
    Car: ["Universal for car", "...", "..."],
    Scooty: ["Universal for scooty", "...", "..."],
  };

  // Function to update selected categories
  const toggleCategory = (e) => {
    const selectedCategory = e.target.value;

    if (category.includes(selectedCategory)) {
      // Remove category and reset subcategories
      setCategory((prev) => prev.filter((item) => item !== selectedCategory));
      setSubCategory([]); // Clear subcategories if no category is selected
    } else {
      setCategory([selectedCategory]); // Allow only one category selection at a time
      setSubCategory([]); // Reset subcategories when category changes
    }
  };

  // Function to update selected subcategories
  const toggleSubCategory = (e) => {
    const selectedSubCategory = e.target.value;

    if (subCategory.includes(selectedSubCategory)) {
      setSubCategory((prev) =>
        prev.filter((item) => item !== selectedSubCategory)
      );
    } else {
      setSubCategory((prev) => [...prev, selectedSubCategory]);
    }
  };

  // Function to apply filters
  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  // Function to sort products
  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {Object.keys(categoryToSubCategories).map((cat) => (
              <p className="flex gap-2" key={cat}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat}
                  checked={category.includes(cat)}
                  onChange={toggleCategory}
                />{" "}
                {cat}
              </p>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {category.length > 0 &&
              categoryToSubCategories[category[0]].map((subCat) => (
                <p className="flex gap-2" key={subCat}>
                  <input
                    className="w-3"
                    type="checkbox"
                    value={subCat}
                    checked={subCategory.includes(subCat)}
                    onChange={toggleSubCategory}
                  />{" "}
                  {subCat}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
