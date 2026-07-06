// frontend/app/(user)/checkout/page.js
"use client";
import { useState, useMemo } from "react";
import { useCart } from "../../../hooks/useCart";
import { useOrder } from "../../../hooks/useOrder";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "../../../components/ui/Spinner";

// Structured data representing all 7 provinces and their respective 77 districts
const NEPAL_PROVINCES_AND_DISTRICTS = {
  "Koshi Province": [
    "Bhojpur",
    "Dhankuta",
    "Ilam",
    "Jhapa",
    "Khotang",
    "Morang",
    "Okhaldhunga",
    "Panchthar",
    "Sankhuwasabha",
    "Solukhumbu",
    "Sunsari",
    "Taplejung",
    "Terhathum",
    "Udayapur",
  ],
  "Madhesh Province": [
    "Bara",
    "Dhanusha",
    "Mahottari",
    "Parsa",
    "Rautahat",
    "Saptari",
    "Sarlahi",
    "Siraha",
  ],
  "Bagmati Province": [
    "Bhaktapur",
    "Chitwan",
    "Dhading",
    "Dolakha",
    "Kathmandu",
    "Kavrepalanchok",
    "Lalitpur",
    "Makwanpur",
    "Nuwakot",
    "Ramechhap",
    "Rasuwa",
    "Sindhuli",
    "Sindhupalchok",
  ],
  "Gandaki Province": [
    "Baglung",
    "Gorkha",
    "Kaski",
    "Lamjung",
    "Manang",
    "Mustang",
    "Myagdi",
    "Nawalpur",
    "Parbat",
    "Syangja",
    "Tanahun",
  ],
  "Lumbini Province": [
    "Arghakhanchi",
    "Banke",
    "Bardiya",
    "Dang",
    "Gulmi",
    "Kapilvastu",
    "Parasi",
    "Palpa",
    "Pyuthan",
    "Rolpa",
    "Rukum Purba",
    "Rupandehi",
  ],
  "Karnali Province": [
    "Dailekh",
    "Dolpa",
    "Humla",
    "Jajarkot",
    "Jumla",
    "Kalikot",
    "Mugu",
    "Rukum Paschim",
    "Salyan",
    "Surkhet",
  ],
  "Sudurpashchim Province": [
    "Achham",
    "Baitadi",
    "Bajhang",
    "Bajura",
    "Dadeldhura",
    "Darchula",
    "Doti",
    "Kailali",
    "Kanchanpur",
  ],
};

const PAYMENT_METHODS = [
  {
    value: "cash_on_delivery",
    label: "💵 Cash on Delivery",
    desc: "Pay when your order arrives",
  },
  { value: "esewa", label: "🟢 eSewa", desc: "Pay via eSewa digital wallet" },
  {
    value: "khalti",
    label: "🟣 Khalti",
    desc: "Pay via Khalti digital wallet",
  },
];

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  province: "Bagmati Province",
  district: "Kathmandu",
};

export default function CheckoutPage() {
  const { cart, cartTotal, loading: cartLoading } = useCart();
  const { placeOrder, loading: orderLoading } = useOrder();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [paymentMethod, setPayment] = useState("cash_on_delivery");
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=review
  const [placed, setPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const items = cart?.items || [];
  const subtotal = cartTotal || 0;
  const deliveryCharge = subtotal >= 2000 ? 0 : 150;
  const totalAmount = subtotal + deliveryCharge;

  // Memoize the district options matching the selected province
  const availableDistricts = useMemo(() => {
    return NEPAL_PROVINCES_AND_DISTRICTS[form.province] || [];
  }, [form.province]);

  // Automatically reset selected district if it isn't part of the newly chosen province
  const handleProvinceChange = (e) => {
    const nextProvince = e.target.value;
    const districtsForProvince =
      NEPAL_PROVINCES_AND_DISTRICTS[nextProvince] || [];
    setForm({
      ...form,
      province: nextProvince,
      district: districtsForProvince[0] || "",
    });
  };

  // ── Validate Address ──
  const validateAddress = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.province) errs.province = "Province is required";
    if (!form.district) errs.district = "District is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateAddress()) return;
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = async () => {
    const result = await placeOrder({
      shippingAddress: form,
      paymentMethod,
    });
    if (result) {
      setPlaced(true);
      setPlacedOrder(result.order);
    }
  };

  // ── Success Screen ──
  if (placed && placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-7xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
            Order Placed!
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            Your order has been successfully placed.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-5">
            <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-1">
              Order Reference
            </p>
            <p className="text-lg font-extrabold text-blue-700 font-mono">
              {placedOrder.orderRef}
            </p>
          </div>
          <div className="space-y-2 text-sm text-left bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-bold text-blue-700">
                Rs. {placedOrder.totalAmount?.toLocaleString("en-NP")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="font-semibold capitalize">
                {placedOrder.paymentMethod?.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-yellow-600 font-semibold">⏳ Pending</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/my-orders"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold
              text-sm hover:bg-blue-700 transition text-center"
            >
              📦 View My Orders
            </Link>
            <Link
              href="/products"
              className="w-full py-3 border border-gray-200 text-gray-700
              rounded-xl font-medium text-sm hover:bg-gray-50 transition text-center"
            >
              🛒 Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Spinner size="xl" color="blue" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-xl font-bold text-gray-700 mb-3">
            Your cart is empty
          </h2>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm
            font-semibold hover:bg-blue-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">🏷️ Checkout</h1>
          <p className="text-gray-400 text-sm mt-1">Complete your order</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {["Shipping", "Payment", "Review"].map((label, idx) => {
            const stepNum = idx + 1;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center gap-2 ${stepNum <= step ? "text-blue-600" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-bold border-2 transition
                  ${
                    step === stepNum
                      ? "bg-blue-600 border-blue-600 text-white"
                      : stepNum < step
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 text-gray-400"
                  }`}
                  >
                    {stepNum < step ? "✓" : stepNum}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block">
                    {label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-0.5 rounded mx-2 transition
                  ${stepNum < step ? "bg-blue-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2">
            {/* STEP 1 — Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-800 mb-5">
                  📍 Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      placeholder="e.g. Ram Bahadur Thapa"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${errors.fullName ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        ⚠️ {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="e.g. 9841234567"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${errors.phone ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        ⚠️ {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="e.g. Thamel, House No. 23"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${errors.address ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        ⚠️ {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      City / Settlement *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      placeholder="e.g. Koteshwor"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${errors.city ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        ⚠️ {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Province Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Province *
                    </label>
                    <select
                      value={form.province}
                      onChange={handleProvinceChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {Object.keys(NEPAL_PROVINCES_AND_DISTRICTS).map(
                        (prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* District Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      District *
                    </label>
                    <select
                      value={form.district}
                      onChange={(e) =>
                        setForm({ ...form, district: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {availableDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl
                  font-bold text-sm hover:bg-blue-700 transition shadow-md shadow-blue-200"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-800 mb-5">
                  💳 Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2
                      cursor-pointer transition
                      ${
                        paymentMethod === pm.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.value}
                        checked={paymentMethod === pm.value}
                        onChange={() => setPayment(pm.value)}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800">
                          {pm.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {pm.desc}
                        </p>
                      </div>
                      {paymentMethod === pm.value && (
                        <span className="text-blue-600 text-lg">✓</span>
                      )}
                    </label>
                  ))}
                </div>

                {(paymentMethod === "esewa" || paymentMethod === "khalti") && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <p className="text-xs text-yellow-700 font-medium">
                      ⚠️ {paymentMethod === "esewa" ? "eSewa" : "Khalti"}{" "}
                      gateway integration coming soon. For now, your order will
                      be processed as Cash on Delivery.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 text-gray-700
                    rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl
                    font-bold text-sm hover:bg-blue-700 transition shadow-md shadow-blue-200"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Shipping Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800 text-sm">
                      📍 Shipping To
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-800">
                      {form.fullName}
                    </p>
                    <p>{form.phone}</p>
                    <p>
                      {form.address}, {form.city}, {form.district},{" "}
                      {form.province}
                    </p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800 text-sm">
                      💳 Payment
                    </h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 font-medium capitalize">
                    {
                      PAYMENT_METHODS.find((p) => p.value === paymentMethod)
                        ?.label
                    }
                  </p>
                </div>

                {/* Items Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-gray-800 text-sm mb-3">
                    🛒 Items ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50
                        border border-gray-100 flex-shrink-0"
                        >
                          {item.product?.images?.[0]?.url ? (
                            <img
                              src={item.product.images[0].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-blue-700 flex-shrink-0">
                          Rs.{" "}
                          {(item.priceAtAdd * item.quantity).toLocaleString(
                            "en-NP",
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place Order */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 border border-gray-200 text-gray-700
                    rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600
                    text-white rounded-xl font-bold text-sm hover:shadow-lg
                    hover:shadow-blue-200 transition disabled:opacity-60
                    flex items-center justify-center gap-2"
                  >
                    {orderLoading ? (
                      <>
                        <Spinner size="sm" color="white" /> Placing...
                      </>
                    ) : (
                      "✅ Place Order"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <h2 className="font-bold text-gray-800 text-sm mb-4">
                📋 Order Summary
              </h2>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-xs text-gray-500"
                  >
                    <span className="truncate max-w-[140px]">
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-700 ml-2">
                      Rs.{" "}
                      {(item.priceAtAdd * item.quantity).toLocaleString(
                        "en-NP",
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    Rs. {subtotal.toLocaleString("en-NP")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span
                    className={`font-semibold ${deliveryCharge === 0 ? "text-green-600" : ""}`}
                  >
                    {deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge}`}
                  </span>
                </div>
                {deliveryCharge === 0 && (
                  <p className="text-xs text-green-500">
                    🎉 Free delivery on orders over Rs. 2,000!
                  </p>
                )}
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="text-xl font-extrabold text-blue-700">
                    Rs. {totalAmount.toLocaleString("en-NP")}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  All prices in Nepali Rupees
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
