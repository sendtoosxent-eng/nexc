"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";


import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";

const Checkout = () => {
  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cartReducer.items);

  const totalPrice = useSelector(selectTotalPrice);

  const [loading, setLoading] = useState(false);

  // USER DATA
  const [user, setUser] = useState<any>(null);

  // BILLING FORM
  const [billingData, setBillingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Uganda",
    city: "",
    address: "",
    notes: "",
    paymentMethod: "Cash On Delivery",
  });

  // CHECK LOGIN
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");

    if (!loggedUser) {
      alert("Please login first before checkout.");

      router.push("/signin");
    } else {
      const parsedUser = JSON.parse(loggedUser);

      setUser(parsedUser);

      setBillingData((prev) => ({
        ...prev,
        fullName: parsedUser.name || "",
        email: parsedUser.email || "",
      }));
    }
  }, [router]);

  // HANDLE INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setBillingData({
      ...billingData,
      [e.target.name]: e.target.value,
    });
  };

  // PROCESS ORDER
const handleCheckout = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (cartItems.length === 0) {
    alert("Your cart is empty");
    return;
  }

  if (!user) {
    alert("Please login first");
    router.push("/signin");
    return;
  }

  try {
    setLoading(true);

    // ORDER DATA
    const orderData = {
      user_id: user.id,
      customer_name: billingData.fullName,
      customer_email: billingData.email,
      phone: billingData.phone,
      country: billingData.country,
      city: billingData.city,
      address: billingData.address,
      notes: billingData.notes,
      payment_method: billingData.paymentMethod,
      total: totalPrice,
      status: "Pending",
      items: cartItems,
    };

    // SEND TO API
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Order placed successfully!");

      // SAVE ORDER DETAILS
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderId: data.orderId,
          total: totalPrice,
          status: "Pending",
        })
      );

      // CLEAR CART
      localStorage.removeItem("cartItems");

      // REDIRECT TO DASHBOARD
      router.push("/dashboard");
    } else {
      alert(data.message || "Failed to place order");
    }
  } catch (error) {
    console.log(error);

    alert("Something went wrong while processing your order");
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

          <form onSubmit={handleCheckout}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">

              {/* LEFT SIDE */}
              <div className="lg:max-w-[670px] w-full">

                {/* LOGIN */}
                <Login />

                {/* BILLING */}
                <div className="bg-white shadow-1 rounded-[10px] p-5 sm:p-8 mt-7">
                  <h3 className="text-2xl font-semibold mb-6">
                    Billing Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label className="block mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={billingData.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2">
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={billingData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2">
                        Phone Number(Number to recieve the order)
                      </label>

                      <input
                        type="text"
                        name="phone"
                        value={billingData.phone}
                        onChange={handleChange}
                        placeholder="+256..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={billingData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2">
                        Address
                      </label>

                      <input
                        type="text"
                        name="address"
                        value={billingData.address}
                        onChange={handleChange}
                        placeholder="Enter delivery address"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2">
                        Other Notes
                      </label>

                      <textarea
                        name="notes"
                        rows={5}
                        value={billingData.notes}
                        onChange={handleChange}
                        placeholder="Notes about your order"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SHIPPING */}
                <Shipping />
              </div>

              {/* RIGHT SIDE */}
              <div className="max-w-[455px] w-full">

                {/* ORDER SUMMARY */}
                <div className="bg-white shadow-1 rounded-[10px]">

                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">

                    {/* HEADERS */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <h4 className="font-medium text-dark">
                        Product
                      </h4>

                      <h4 className="font-medium text-dark text-right">
                        Subtotal
                      </h4>
                    </div>

                    {/* PRODUCTS */}
                    {cartItems.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-5 border-b border-gray-3"
                      >
                        <div>
                          <p className="text-dark">
                            {item.title} x {item.quantity}
                          </p>
                        </div>

                        <div>
                          <p className="text-dark text-right">
                            UGX{" "}
                            {(
                              item.discountedPrice * item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* TOTAL */}
                    <div className="flex items-center justify-between pt-5">
                      <p className="font-medium text-lg text-dark">
                        Total
                      </p>

                      <p className="font-bold text-xl text-blue">
                        UGX {totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* COUPON */}
                <Coupon />

                {/* SHIPPING METHOD */}
                <ShippingMethod />
                 
                {/* PAYMENT */}
                <PaymentMethod />

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-blue py-4 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  {loading
                    ? "Processing Order..."
                    : "Process to Checkout"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;