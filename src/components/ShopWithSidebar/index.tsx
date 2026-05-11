"use client";
import React, { useState, useEffect, useMemo } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import shopData from "../Shop/shopData";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";

const ShopWithSidebar = () => {
  // --- View & UI States ---
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  
  // --- Filter States ---
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  // Dynamic category counts based on current shopData
  const categories = [
    { name: "All", products: shopData.length },
    { name: "Phone", products: shopData.filter(p => p.category === "Phone").length },
    { name: "Watch", products: shopData.filter(p => p.category === "Watch").length },
    { name: "Laptop", products: 0 }, // Add others as needed
    { name: "Monitor", products: 0 },
  ];

  // --- Core Filtering Logic ---
  const filteredProducts = useMemo(() => {
    return shopData.filter((product) => {
      // 1. Check Category
      const matchesCategory = 
        selectedCategory === "All" || product.category === selectedCategory;
      
      // 2. Check Search (Matches title or category)
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <>
      <Breadcrumb title={"Explore All Products"} pages={["shop", "/", "shop with sidebar"]} />
      
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            
            {/* Sidebar Filter Section */}
            <div className={`sidebar-content fixed xl:z-1 z-[9999] left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
              productSidebar ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto" : "-translate-x-full"
            }`}>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-dark">Filters</p>
                      <button 
                        type="button"
                        onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} 
                        className="text-blue text-sm hover:underline"
                      >
                        Reset All
                      </button>
                    </div>
                  </div>

                  <CategoryDropdown 
                    categories={categories} 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory} 
                  />
                  
                  
                  
                  <ColorsDropdwon />
                  <PriceDropdown />
                </div>
              </form>
            </div>

            {/* Main Product Area */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <CustomSelect options={options} />
                    
                    {/* Active Search Bar */}
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-3 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-blue"
                      />
                    </div>

                    <p className="hidden sm:block text-sm">
                      Showing <span className="text-dark font-bold">{filteredProducts.length}</span> Products
                    </p>
                  </div>

                  {/* Toggle View Buttons */}
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => setProductStyle("grid")} 
                      className={`p-2 rounded-md ${productStyle === "grid" ? "bg-blue text-white" : "bg-gray-2 text-dark"}`}
                    >
                      Grid
                    </button>
                    <button 
                      onClick={() => setProductStyle("list")} 
                      className={`p-2 rounded-md ${productStyle === "list" ? "bg-blue text-white" : "bg-gray-2 text-dark"}`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid/List Display */}
              <div className={productStyle === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9" : "flex flex-col gap-7.5"}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    productStyle === "grid" 
                      ? <SingleGridItem item={item} key={item.id} /> 
                      : <SingleListItem item={item} key={item.id} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-lg shadow-1">
                    <p className="text-xl text-body">No products found in "{selectedCategory}"</p>
                    <button 
                      onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                      className="mt-4 text-blue font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;