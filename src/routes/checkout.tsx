import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Tag,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";
import { GradientButton } from "@/components/shared/GradientButton";
import { SoftCard } from "@/components/shared/SoftCard";
import { useAuth } from "@/hooks/useAuth";
import {
  applyCoupon,
  getClasses,
  processPayment,
  type CouponResult,
} from "@/services/apiClient";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Choose your class — Lumin" },
      { name: "description", content: "Pick your class and unlock the full Lumin experience." },
    ],
  }),
  component: CheckoutPage,
});

type ClassPlan = {
  id: number;
  name: string;
  label: string;
  price: number;
  originalPrice: number;
};

function CheckoutPage() {
  const { user, ready, update } = useAuth();
  const navigate = useNavigate();

  const [classes, setClasses] = useState<ClassPlan[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState<CouponResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  useEffect(() => {
    let cancelled = false;
    getClasses().then((res) => {
      if (cancelled) return;
      setClasses(res as ClassPlan[]);
      setSelectedId(10); // sensible default
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = classes?.find((c) => c.id === selectedId) ?? null;
  const subtotal = selected?.price ?? 0;
  const discount =
    couponState && couponState.valid ? couponState.discountAmount : 0;
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!coupon.trim() || !selected) return;
    setCouponLoading(true);
    setCouponState(null);
    const res = await applyCoupon(coupon, subtotal);
    setCouponLoading(false);
    setCouponState(res);
    if (!res.valid) setShake((n) => n + 1);
  };

  const handlePay = async () => {
    if (!selected) return;
    setPaying(true);
    try {
      await processPayment({
        classId: selected.id,
        amount: total,
        couponCode: couponState?.valid ? couponState.code : undefined,
      });
      update({ classId: selected.id, paid: true });
      navigate({ to: "/dashboard" });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-mesh">
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-slate-800">
            Lumin
          </span>
        </Link>
        <Link
          to="/"
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>

      <main className="px-6 lg:px-12 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
            Pick your class
          </h1>
          <p className="text-slate-500 mt-2">
            Pricing is tailored to your class. You can switch anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Class grid */}
          <div className="lg:col-span-2">
            <SoftCard className="p-6 md:p-8">
              {!classes ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="skeleton h-24 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {classes.map((c) => {
                    const active = c.id === selectedId;
                    return (
                      <motion.button
                        key={c.id}
                        variants={fadeUp}
                        onClick={() => setSelectedId(c.id)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "relative p-4 rounded-2xl text-left border transition-all",
                          active
                            ? "bg-gradient-to-br from-purple-500 to-purple-400 border-transparent text-white shadow-glow"
                            : "bg-white border-slate-200 hover:border-purple-300 text-slate-800",
                        )}
                      >
                        <p
                          className={cn(
                            "text-xs font-semibold uppercase tracking-wider",
                            active ? "text-white/80" : "text-purple-600",
                          )}
                        >
                          {c.label}
                        </p>
                        <p className="text-lg font-bold mt-1">{c.name}</p>
                        <p
                          className={cn(
                            "text-sm mt-1",
                            active ? "text-white/90" : "text-slate-500",
                          )}
                        >
                          ₹{c.price.toLocaleString("en-IN")}/yr
                        </p>
                        {active && (
                          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}

              <div className="mt-8 p-5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    7-day money-back guarantee
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Not loving it? Get a full refund within 7 days, no questions
                    asked.
                  </p>
                </div>
              </div>
            </SoftCard>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <motion.div
              key={shake}
              animate={
                couponState && !couponState.valid
                  ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.45 }}
              className="lg:sticky lg:top-6"
            >
              <SoftCard className="p-6 md:p-7">
                <h2 className="font-display font-bold text-lg text-slate-800">
                  Order summary
                </h2>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Plan</span>
                    <span className="font-semibold text-slate-800">
                      {selected ? `${selected.name} · Annual` : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-semibold text-slate-800">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Discount {couponState && couponState.valid && `(${couponState.code})`}
                      </span>
                      <span className="font-semibold text-emerald-600">
                        -₹{discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Coupon */}
                <div className="mt-5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Have a coupon?
                  </label>
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2.5 border border-slate-200 focus-within:border-purple-400 focus-within:bg-white transition">
                      <Tag className="h-4 w-4 text-slate-400" />
                      <input
                        value={coupon}
                        onChange={(e) => {
                          setCoupon(e.target.value.toUpperCase());
                          setCouponState(null);
                        }}
                        placeholder="STUDENT10"
                        className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 uppercase"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!coupon.trim() || couponLoading}
                      className="px-4 py-2.5 rounded-2xl bg-purple-50 text-purple-600 text-sm font-semibold hover:bg-purple-100 disabled:opacity-50 transition"
                    >
                      {couponLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {couponState && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "mt-2 text-xs flex items-center gap-1.5",
                          couponState.valid
                            ? "text-emerald-600"
                            : "text-red-500",
                        )}
                      >
                        {couponState.valid ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Coupon applied — you
                            saved ₹{couponState.discountAmount.toLocaleString("en-IN")}
                          </>
                        ) : (
                          <>
                            <X className="h-3.5 w-3.5" /> {couponState.reason}
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Try <span className="font-semibold">STUDENT10</span> for 10%
                    off
                  </p>
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Total</span>
                  <span className="font-display font-bold text-2xl text-slate-800">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <GradientButton
                  size="lg"
                  className="w-full mt-5"
                  loading={paying}
                  disabled={!selected}
                  onClick={handlePay}
                >
                  Pay & Continue
                </GradientButton>

                <p className="text-[11px] text-slate-400 text-center mt-3">
                  Secured by 256-bit encryption · UPI, Cards, Netbanking
                </p>
              </SoftCard>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
