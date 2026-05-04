import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GradientButton } from "@/components/shared/GradientButton";
import { sendOtp, verifyOtp } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";

type Step = "phone" | "otp";

export function LoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setOtp(["", "", "", "", "", ""]);
      setError(null);
      setResendIn(0);
    }
  }, [open]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const handleSendOtp = async () => {
    setError(null);
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setSending(true);
    try {
      await sendOtp("+91" + phone);
      setStep("otp");
      setResendIn(30);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch {
      setError("Couldn't send OTP. Try again.");
    } finally {
      setSending(false);
    }
  };

  const handleOtpChange = (idx: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    if (v && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError(null);
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code");
      return;
    }
    setVerifying(true);
    try {
      const res = await verifyOtp("+91" + phone, code);
      login({
        id: res.user.id,
        name: res.user.name,
        phone: res.user.phone,
      });
      onOpenChange(false);
      navigate({ to: "/checkout" });
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 bg-white rounded-3xl border-0 shadow-soft-lg overflow-hidden">
        <div className="relative p-8">
          <div className="absolute top-0 right-0 h-32 w-32 bg-purple-100 rounded-full blur-3xl opacity-60 -translate-y-10 translate-x-10" />
          <div className="absolute top-0 left-0 h-32 w-32 bg-pink-100 rounded-full blur-3xl opacity-60 -translate-y-10 -translate-x-10" />

          <div className="relative">
            <AnimatePresence mode="wait">
              {step === "phone" ? (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-center mb-5">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shadow-glow">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 text-center">
                    Welcome to Lumin
                  </h2>
                  <p className="text-sm text-slate-500 text-center mt-1">
                    Sign in with your mobile number to continue
                  </p>

                  <div className="mt-7">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Mobile number
                    </label>
                    <div className="mt-2 flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 focus-within:border-purple-400 focus-within:bg-white transition">
                      <Phone className="h-5 w-5 text-slate-400" />
                      <span className="text-slate-700 font-medium">+91</span>
                      <input
                        autoFocus
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="98765 43210"
                        className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 mt-3">{error}</p>
                  )}

                  <GradientButton
                    onClick={handleSendOtp}
                    loading={sending}
                    size="lg"
                    className="w-full mt-6"
                  >
                    Send OTP
                  </GradientButton>

                  <p className="text-xs text-slate-400 text-center mt-4">
                    By continuing you agree to our Terms & Privacy Policy
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => setStep("phone")}
                    className="text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1 text-sm"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <div className="flex justify-center mb-5">
                    <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                      <ShieldCheck className="h-7 w-7 text-purple-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 text-center">
                    Verify your number
                  </h2>
                  <p className="text-sm text-slate-500 text-center mt-1">
                    Enter the 6-digit code sent to <br />
                    <span className="font-semibold text-slate-700">+91 {phone}</span>
                  </p>

                  <div className="mt-7 flex justify-center gap-2">
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputsRef.current[i] = el;
                        }}
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="h-12 w-11 rounded-xl bg-slate-50 border border-slate-200 text-center text-lg font-bold text-slate-800 outline-none focus:border-purple-400 focus:bg-white transition"
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 mt-3 text-center">{error}</p>
                  )}

                  <GradientButton
                    onClick={handleVerify}
                    loading={verifying}
                    size="lg"
                    className="w-full mt-6"
                  >
                    Verify & Continue
                  </GradientButton>

                  <div className="text-center mt-4 text-sm">
                    {resendIn > 0 ? (
                      <span className="text-slate-400">Resend code in {resendIn}s</span>
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        className="text-purple-600 font-semibold hover:underline"
                      >
                        Resend code
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 text-center mt-3">
                    Tip: any 6 digits will work in this demo
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
