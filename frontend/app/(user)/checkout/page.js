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
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-surface border border-line rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-7xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-2xl text-ink mb-2 tracking-wide">
            Order Placed!
          </h1>
          <p className="text-ink-soft text-sm mb-4">
            Your order has been successfully placed.
          </p>
          <div className="bg-brand-purple/10 rounded-xl p-4 border border-brand-purple/20 mb-5">
            <p className="text-xs text-brand-purple font-semibold uppercase tracking-wider mb-1">
              Order Reference
            </p>
            <p className="text-lg font-extrabold text-brand-purple font-mono">
              {placedOrder.orderRef}
            </p>
          </div>
          <div className="space-y-2 text-sm text-left bg-surface2 rounded-xl p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-ink-soft">Total Amount</span>
              <span className="font-bold text-brand-orange">
                Rs. {placedOrder.totalAmount?.toLocaleString("en-NP")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Payment</span>
              <span className="font-semibold capitalize text-ink">
                {placedOrder.paymentMethod?.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Status</span>
              <span className="text-yellow-400 font-semibold">⏳ Pending</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/my-orders"
              className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-xl font-bold
              text-sm hover:scale-[1.02] transition text-center"
            >
              📦 View My Orders
            </Link>
            <Link
              href="/products"
              className="w-full py-3 border border-line text-ink
              rounded-xl font-medium text-sm hover:bg-surface2 transition text-center"
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
      <div className="min-h-screen flex justify-center items-center bg-bg">
        <Spinner size="xl" color="blue" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-xl text-ink mb-3 tracking-wide">
            Your cart is empty
          </h2>
          <Link
            href="/products"
            className="bg-gradient-to-r from-brand-purple to-brand-orange text-white px-6 py-2.5 rounded-xl text-sm
            font-semibold hover:scale-105 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-ink tracking-wide">🏷️ Checkout</h1>
          <p className="text-ink-soft text-sm mt-1">Complete your order</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {["Shipping", "Payment", "Review"].map((label, idx) => {
            const stepNum = idx + 1;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center gap-2 ${stepNum <= step ? "text-brand-purple" : "text-ink-soft/50"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-bold border-2 transition
                  ${
                    step === stepNum
                      ? "bg-gradient-to-br from-brand-purple to-brand-orange border-transparent text-white"
                      : stepNum < step
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-line text-ink-soft/50"
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
                  ${stepNum < step ? "bg-brand-purple" : "bg-line"}`}
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
              <div className="bg-surface rounded-2xl border border-line shadow-sm p-6">
                <h2 className="text-base font-bold text-ink mb-5">
                  📍 Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-ink-soft mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      placeholder="e.g. Ram Bahadur Thapa"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-surface2 text-ink
                      focus:outline-none focus:ring-2 focus:ring-brand-purple
                      ${errors.fullName ? "border-red-400" : "border-line"}`}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-xs mt-1">
                        ⚠️ {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-ink-soft mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="e.g. 9841234567"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-surface2 text-ink
                      focus:outline-none focus:ring-2 focus:ring-brand-purple
                      ${errors.phone ? "border-red-400" : "border-line"}`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">
                        ⚠️ {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-ink-soft mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="e.g. Thamel, House No. 23"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-surface2 text-ink
                      focus:outline-none focus:ring-2 focus:ring-brand-purple
                      ${errors.address ? "border-red-400" : "border-line"}`}
                    />
                    {errors.address && (
                      <p className="text-red-400 text-xs mt-1">
                        ⚠️ {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-ink-soft mb-1">
                      City / Settlement *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      placeholder="e.g. Koteshwor"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-surface2 text-ink
                      focus:outline-none focus:ring-2 focus:ring-brand-purple
                      ${errors.city ? "border-red-400" : "border-line"}`}
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1">
                        ⚠️ {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Province Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-ink-soft mb-1">
                      Province *
                    </label>
                    <select
                      value={form.province}
                      onChange={handleProvinceChange}
                      className="w-full border border-line rounded-xl px-3 py-2.5
                      text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple bg-surface2 text-ink"
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
                    <label className="block text-xs font-semibold text-ink-soft mb-1">
                      District *
                    </label>
                    <select
                      value={form.district}
                      onChange={(e) =>
                        setForm({ ...form, district: e.target.value })
                      }
                      className="w-full border border-line rounded-xl px-3 py-2.5
                      text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple bg-surface2 text-ink"
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
                  className="w-full mt-6 py-3 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-xl
                  font-bold text-sm hover:scale-[1.02] transition shadow-md shadow-brand-purple/20"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div className="bg-surface rounded-2xl border border-line shadow-sm p-6">
                <h2 className="text-base font-bold text-ink mb-5">
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
                          ? "border-brand-purple bg-brand-purple/10"
                          : "border-line hover:border-brand-purple/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.value}
                        checked={paymentMethod === pm.value}
                        onChange={() => setPayment(pm.value)}
                        className="accent-brand-purple w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-ink">
                          {pm.label}
                        </p>
                        <p className="text-xs text-ink-soft mt-0.5">
                          {pm.desc}
                        </p>
                      </div>
                      {paymentMethod === pm.value && (
                        <span className="text-brand-purple text-lg">✓</span>
                      )}
                    </label>
                  ))}
                </div>

                {(paymentMethod === "esewa" || paymentMethod === "khalti") && (
                  <div className="mt-4 bg-yellow-500/10 border border-yellow-500/25 rounded-xl p-3">
                    <p className="text-xs text-yellow-300 font-medium">
                      ⚠️ {paymentMethod === "esewa" ? "eSewa" : "Khalti"}{" "}
                      gateway integration coming soon. For now, your order will
                      be processed as Cash on Delivery.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-line text-ink
                    rounded-xl font-medium text-sm hover:bg-surface2 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-xl
                    font-bold text-sm hover:scale-[1.02] transition shadow-md shadow-brand-purple/20"
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
                <div className="bg-surface rounded-2xl border border-line shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-ink text-sm">
                      📍 Shipping To
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-brand-purple hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-ink-soft space-y-1">
                    <p className="font-semibold text-ink">
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
                <div className="bg-surface rounded-2xl border border-line shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-ink text-sm">
                      💳 Payment
                    </h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-brand-purple hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-ink font-medium capitalize">
                    {
                      PAYMENT_METHODS.find((p) => p.value === paymentMethod)
                        ?.label
                    }
                  </p>
                </div>

                {/* Items Summary */}
                <div className="bg-surface rounded-2xl border border-line shadow-sm p-5">
                  <h3 className="font-bold text-ink text-sm mb-3">
                    🛒 Items ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl overflow-hidden bg-surface2
                        border border-line flex-shrink-0"
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
                          <p className="text-sm font-semibold text-ink truncate">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-ink-soft">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-brand-orange flex-shrink-0">
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
                    className="flex-1 py-3 border border-line text-ink
                    rounded-xl font-medium text-sm hover:bg-surface2 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-brand-purple to-brand-orange
                    text-white rounded-xl font-bold text-sm hover:shadow-lg
                    hover:shadow-brand-purple/30 transition disabled:opacity-60
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
            <div className="bg-surface rounded-2xl border border-line shadow-sm p-5 sticky top-24">
              <h2 className="font-bold text-ink text-sm mb-4">
                📋 Order Summary
              </h2>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-xs text-ink-soft"
                  >
                    <span className="truncate max-w-[140px]">
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-ink ml-2">
                      Rs.{" "}
                      {(item.priceAtAdd * item.quantity).toLocaleString(
                        "en-NP",
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-line pt-3 space-y-2 mb-4">
                <div className="flex justify-between text-sm text-ink-soft">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink">
                    Rs. {subtotal.toLocaleString("en-NP")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-ink-soft">
                  <span>Delivery</span>
                  <span
                    className={`font-semibold ${deliveryCharge === 0 ? "text-green-400" : "text-ink"}`}
                  >
                    {deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge}`}
                  </span>
                </div>
                {deliveryCharge === 0 && (
                  <p className="text-xs text-green-400">
                    🎉 Free delivery on orders over Rs. 2,000!
                  </p>
                )}
              </div>
              <div className="border-t border-line pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-ink">Total</span>
                  <span className="text-xl font-display text-brand-orange tracking-wide">
                    Rs. {totalAmount.toLocaleString("en-NP")}
                  </span>
                </div>
                <p className="text-xs text-ink-soft mt-1">
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
