import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

/* ─── Types ─────────────────────────────────────────── */
interface SignInForm {
  email: string;
  password: string;
  remember: boolean;
}

interface SignUpForm {
  fullName: string;
  email: string;
  password: string;
  confirm: string;
  agree: boolean;
}

/* ─── Social Button ──────────────────────────────────── */
const SocialBtn = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <Button
    variant="outline"
    className="w-full gap-2 border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
  >
    {icon}
    <span className="text-sm">{label}</span>
  </Button>
);

/* ─── Google SVG ─────────────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

/* ─── Apple SVG ──────────────────────────────────────── */
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

/* ─── Password Input ─────────────────────────────────── */
const PasswordInput = ({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "••••••••"}
        className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-orange-500/20"
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

/* ─── Password Strength ──────────────────────────────── */
const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: "8+ belgi", ok: password.length >= 8 },
    { label: "Katta harf", ok: /[A-Z]/.test(password) },
    { label: "Raqam", ok: /\d/.test(password) },
    { label: "Belgi", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["", "Juda zaif", "Zaif", "O'rtacha", "Kuchli"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? colors[score] : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((c) => (
            <span
              key={c.label}
              className="flex items-center gap-1 text-[11px]"
              style={{ color: c.ok ? "#22c55e" : "#555" }}
            >
              <Check className="w-2.5 h-2.5" />
              {c.label}
            </span>
          ))}
        </div>
        <span className="text-[11px] font-medium" style={{ color: colors[score] }}>
          {labels[score]}
        </span>
      </div>
    </div>
  );
};

/* ─── SIGN IN ────────────────────────────────────────── */
const SignIn = () => {
  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof SignInForm>(k: K, v: SignInForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-5">
      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <SocialBtn icon={<GoogleIcon />} label="Google" />
        <SocialBtn icon={<AppleIcon />} label="Apple" />
      </div>

      <div className="relative">
        <Separator className="bg-white/8" />
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs text-gray-500 bg-[#111]">
          yoki email bilan
        </span>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="signin-email" className="text-gray-300 text-sm">
            Email
          </Label>
          <Input
            id="signin-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="sizning@email.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-orange-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-pass" className="text-gray-300 text-sm">
              Parol
            </Label>
            <a
              href="#"
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              Unutdingizmi?
            </a>
          </div>
          <PasswordInput
            id="signin-pass"
            value={form.password}
            onChange={(v) => set("password", v)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={form.remember}
            onCheckedChange={(c) => set("remember", !!c)}
            className="border-white/20 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
          />
          <Label
            htmlFor="remember"
            className="text-sm text-gray-400 cursor-pointer"
          >
            Meni eslab qol
          </Label>
        </div>
      </div>

      <Button
        className="w-full gap-2 font-semibold text-base py-5 transition-all hover:opacity-90 hover:shadow-lg"
        style={{ background: "#FF5E14" }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Kirish...
          </span>
        ) : (
          <>
            Kirish <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
};

/* ─── SIGN UP ────────────────────────────────────────── */
const SignUp = () => {
  const [form, setForm] = useState<SignUpForm>({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof SignUpForm>(k: K, v: SignUpForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const passwordMatch =
    form.confirm.length > 0 && form.password === form.confirm;
  const passwordMismatch =
    form.confirm.length > 0 && form.password !== form.confirm;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-5">
      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <SocialBtn icon={<GoogleIcon />} label="Google" />
        <SocialBtn icon={<AppleIcon />} label="Apple" />
      </div>

      <div className="relative">
        <Separator className="bg-white/8" />
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs text-gray-500 bg-[#111]">
          yoki email bilan
        </span>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="signup-name" className="text-gray-300 text-sm">
            To'liq ism
          </Label>
          <Input
            id="signup-name"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Ism Familiya"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-orange-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-gray-300 text-sm">
            Email
          </Label>
          <Input
            id="signup-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="sizning@email.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-orange-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-pass" className="text-gray-300 text-sm">
            Parol
          </Label>
          <PasswordInput
            id="signup-pass"
            value={form.password}
            onChange={(v) => set("password", v)}
          />
          <PasswordStrength password={form.password} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-confirm" className="text-gray-300 text-sm">
            Parolni tasdiqlang
          </Label>
          <div className="relative">
            <PasswordInput
              id="signup-confirm"
              value={form.confirm}
              onChange={(v) => set("confirm", v)}
              placeholder="Parolni qayta kiriting"
            />
            {passwordMatch && (
              <span className="absolute right-10 top-1/2 -translate-y-1/2">
                <Check className="w-4 h-4 text-green-500" />
              </span>
            )}
          </div>
          {passwordMismatch && (
            <p className="text-xs text-red-400 mt-1">Parollar mos kelmadi</p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="agree"
            checked={form.agree}
            onCheckedChange={(c) => set("agree", !!c)}
            className="mt-0.5 border-white/20 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
          />
          <Label
            htmlFor="agree"
            className="text-sm text-gray-400 cursor-pointer leading-relaxed"
          >
            Men{" "}
            <a href="#" className="text-orange-400 hover:underline">
              Foydalanish shartlari
            </a>{" "}
            va{" "}
            <a href="#" className="text-orange-400 hover:underline">
              Maxfiylik siyosati
            </a>
            ga roziman
          </Label>
        </div>
      </div>

      <Button
        className="w-full gap-2 font-semibold text-base py-5 transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-40"
        style={{ background: "#FF5E14" }}
        onClick={handleSubmit}
        disabled={loading || !form.agree || passwordMismatch}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Ro'yxatdan o'tish...
          </span>
        ) : (
          <>
            Ro'yxatdan o'tish <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
};

/* ─── MAIN AUTH PAGE ─────────────────────────────────── */
const Auth = () => {
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#080808",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        .display-font { font-family: 'Syne', sans-serif; }
      `}</style>

      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-between p-14 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f0800 0%, #1a0d00 50%, #0a0a0a 100%)",
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, white 40px, white 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, white 40px, white 41px)",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "#FF5E14" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: "#ff2d55" }}
        />

        {/* Logo */}
        <div className="relative z-10 display-font text-2xl font-bold">
          <span style={{ color: "#FF5E14" }}>NOVA</span>SHOP
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-6">
          <Badge
            className="gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase border-0"
            style={{ background: "rgba(255,94,20,0.15)", color: "#FF5E14" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#FF5E14" }}
            />
            Yangi a'zolarga −20%
          </Badge>

          <h2 className="display-font text-5xl xl:text-6xl font-black leading-tight text-white">
            Xaridni
            <br />
            <span style={{ color: "#FF5E14" }}>qulayroq</span>
            <br />
            qiling
          </h2>

          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Minglab mahsulotlar, eksklyuziv chegirmalar va tez yetkazib berish —
            hammasi bir joyda.
          </p>

          {/* Feature list */}
          <div className="space-y-3 pt-2">
            {[
              "50,000+ mahsulot assortimenti",
              "30 kungacha qaytarish kafolati",
              "Tez va ishonchli yetkazib berish",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,94,20,0.2)" }}
                >
                  <Check className="w-3 h-3" style={{ color: "#FF5E14" }} />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div
          className="relative z-10 p-5 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-gray-300 text-sm leading-relaxed italic">
            "NovaShop orqali xarid qilish juda qulay. Mahsulotlar sifatli va
            yetkazib berish tez!"
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "#FF5E14" }}
            >
              Z
            </div>
            <div>
              <div className="text-white text-sm font-medium">Zulfiya R.</div>
              <div className="text-gray-500 text-xs">Toshkent</div>
            </div>
            <div className="ml-auto flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="w-3 h-3" viewBox="0 0 12 12">
                  <polygon
                    points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"
                    fill="#FF5E14"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="lg:hidden display-font text-2xl font-bold mb-10">
          <span style={{ color: "#FF5E14" }}>NOVA</span>SHOP
        </div>

        <div className="w-full max-w-md">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: "rgba(255,94,20,0.15)" }}
          >
            <ShoppingBag className="w-6 h-6" style={{ color: "#FF5E14" }} />
          </div>

          <Card
            className="border-0 shadow-none"
            style={{ background: "transparent" }}
          >
            <CardHeader className="px-0 pt-0 pb-6">
              <CardTitle className="display-font text-3xl font-black text-white">
                Xush kelibsiz
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm mt-1">
                Hisobingizga kiring yoki yangi hisob yarating
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <Tabs defaultValue="signin">
                <TabsList
                  className="w-full mb-6 p-1 rounded-xl h-auto"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <TabsTrigger
                    value="signin"
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:text-white data-[state=inactive]:text-gray-500 transition-all"
                    style={
                      {
                        "--tw-ring-shadow": "none",
                      } as React.CSSProperties
                    }
                  >
                    Kirish
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:text-white data-[state=inactive]:text-gray-500 transition-all"
                  >
                    Ro'yxatdan o'tish
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-0">
                  <SignIn />
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <SignUp />
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="px-0 pt-2 pb-0">
              <p className="text-xs text-center text-gray-600 w-full">
                Davom etish orqali siz bizning{" "}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Foydalanish shartlari
                </a>
                ga rozilik bildirasiz
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;