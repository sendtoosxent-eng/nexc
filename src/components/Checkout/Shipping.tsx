"use client";

import React, { useState } from "react";

const Shipping = () => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      {/* HEADER */}
      <div
        onClick={() => setDropdown(!dropdown)}
        className="cursor-pointer flex items-center justify-between font-medium text-lg text-dark py-5 px-5.5"
      >
        <span>Delivery to a different address?</span>

        <svg
          className={`transition-all duration-300 ${
            dropdown ? "rotate-180" : ""
          }`}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
            fill="#111827"
          />
        </svg>
      </div>

      {/* DROPDOWN */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          dropdown ? "max-h-[1200px] p-4 sm:p-8.5" : "max-h-0 px-4"
        }`}
      >
        {/* COUNTRY */}
        <div className="mb-5">
          <label htmlFor="countryName" className="block mb-2.5">
            Country / Region <span className="text-red">*</span>
          </label>

          <div className="relative">
            <select className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark py-3 pl-5 pr-10 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20">
              <option>Uganda</option>
              <option>Kenya</option>
              <option>Tanzania</option>
              <option>Rwanda</option>
            </select>

            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.41469 5.03569L8.00039 10.6667L13.5861 5.03569"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5">
            Street Address <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="address"
            placeholder="House number and street name"
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
          />

          <div className="mt-5">
            <input
              type="text"
              name="address2"
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        {/* CITY */}
        <div className="mb-5">
          <label htmlFor="town" className="block mb-2.5">
            Town / City <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="town"
            placeholder="Enter your city"
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
          />
        </div>

        {/* COUNTRY */}
        <div className="mb-5">
          <label htmlFor="country" className="block mb-2.5">
            Country
          </label>

          <input
            type="text"
            name="country"
            placeholder="Enter country"
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
          />
        </div>

        {/* PHONE */}
        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            Phone <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="phone"
            placeholder="+256..."
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label htmlFor="email" className="block mb-2.5">
            Email Address <span className="text-red">*</span>
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Shipping;