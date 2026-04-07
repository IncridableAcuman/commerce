import { useState } from "react";
import {
  Package,
  FileText,
  DollarSign,
  Tag,
  Ruler,
  ToggleLeft,
  ImagePlus,
  Loader2,
  ArrowRight,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import adminAxiosInstance from "../api/axiosInstance";

type Category = "SPORT" | "CLOTHES";
type Size = "X" | "XL" | "L" | "M" | "XM";
type Status = "ACTIVE" | "INACTIVE";

interface ProductForm {
  title: string;
  description: string;
  price: number;
  category: Category;
  size: Size;
  status: Status;
  image: FileList;
}

const CATEGORIES: Category[] = ["SPORT", "CLOTHES"];
const SIZES: Size[] = ["X", "XL", "L", "M", "XM"];
const STATUSES: Status[] = ["ACTIVE", "INACTIVE"];

const AddItems = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      status: "ACTIVE",
    },
  });

  const selectedSize = watch("size");
  const selectedCategory = watch("category");
  const selectedStatus = watch("status");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm fayl yuklash mumkin");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: ProductForm) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", String(values.price));
      formData.append("category", values.category);
      formData.append("size", values.size);
      formData.append("status", values.status);
      formData.append("image", values.image[0]);

      await adminAxiosInstance.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Mahsulot muvaffaqiyatli qo'shildi");
      reset();
      setPreview(null);
    } catch (error) {
      console.log(error);
      toast.error("Mahsulot qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-medium text-gray-900">Add product</h1>
        <p className="text-sm text-gray-400 mt-0.5">Yangi mahsulot qo'shing</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image upload */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Mahsulot rasmi
          </p>

          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Rasm majburiy" })}
              onChange={(e) => {
                register("image").onChange(e);
                handleImageChange(e);
              }}
              className="hidden"
            />
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-52 object-cover rounded-xl border border-gray-100"
                />
                <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm font-medium">Rasmni o'zgartirish</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-400 transition-all"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors ${
                errors.image ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"
              }`}>
                <ImagePlus size={24} className="text-gray-300" />
                <p className="text-sm text-gray-400">Rasm yuklash uchun bosing</p>
                <p className="text-xs text-gray-300">PNG, JPG, WEBP</p>
              </div>
            )}
          </label>
          {errors.image && (
            <p className="text-xs text-red-400">{errors.image.message}</p>
          )}
        </div>

        {/* Main fields */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Asosiy ma'lumotlar
          </p>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Nomi
            </label>
            <div className={`flex items-center gap-2 border rounded-lg px-3 transition-all duration-200 ${
              errors.title
                ? "border-red-400 ring-2 ring-red-100"
                : "border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
            }`}>
              <Package size={15} className="text-gray-400 shrink-0" />
              <input
                {...register("title", {
                  required: "Nomi majburiy",
                  minLength: { value: 5, message: "Kamida 5 ta belgi" },
                  maxLength: { value: 100, message: "Ko'pi bilan 100 ta belgi" },
                })}
                type="text"
                placeholder="Mahsulot nomi"
                className="flex-1 py-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-300"
              />
            </div>
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Tavsif
            </label>
            <div className={`flex items-start gap-2 border rounded-lg px-3 pt-2.5 transition-all duration-200 ${
              errors.description
                ? "border-red-400 ring-2 ring-red-100"
                : "border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
            }`}>
              <FileText size={15} className="text-gray-400 shrink-0 mt-0.5" />
              <textarea
                {...register("description", {
                  required: "Tavsif majburiy",
                  minLength: { value: 10, message: "Kamida 10 ta belgi" },
                  maxLength: { value: 255, message: "Ko'pi bilan 255 ta belgi" },
                })}
                placeholder="Mahsulot haqida qisqacha..."
                rows={3}
                className="flex-1 py-0.5 pb-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-300 resize-none"
              />
            </div>
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Narxi
            </label>
            <div className={`flex items-center gap-2 border rounded-lg px-3 transition-all duration-200 ${
              errors.price
                ? "border-red-400 ring-2 ring-red-100"
                : "border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
            }`}>
              <DollarSign size={15} className="text-gray-400 shrink-0" />
              <input
                {...register("price", {
                  required: "Narx majburiy",
                  min: { value: 0.01, message: "Narx 0 dan katta bo'lishi kerak" },
                  valueAsNumber: true,
                })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="flex-1 py-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-300"
              />
            </div>
            {errors.price && <p className="text-xs text-red-400">{errors.price.message}</p>}
          </div>
        </div>

        {/* Category, Size, Status */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Kategoriya va o'lcham
          </p>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider items-center gap-1.5">
              <Tag size={11} /> Kategoriya
            </label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="cursor-pointer">
                  <input
                    {...register("category", { required: "Kategoriya tanlang" })}
                    type="radio"
                    value={cat}
                    className="hidden"
                  />
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    selectedCategory === cat
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600"
                  }`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
            {errors.category && <p className="text-xs text-red-400">{errors.category.message}</p>}
          </div>

          {/* Size */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider items-center gap-1.5">
              <Ruler size={11} /> O'lcham
            </label>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((s) => (
                <label key={s} className="cursor-pointer">
                  <input
                    {...register("size", { required: "O'lcham tanlang" })}
                    type="radio"
                    value={s}
                    className="hidden"
                  />
                  <span className={`inline-flex items-center justify-center w-12 h-10 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    selectedSize === s
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600"
                  }`}>
                    {s}
                  </span>
                </label>
              ))}
            </div>
            {errors.size && <p className="text-xs text-red-400">{errors.size.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider items-center gap-1.5">
              <ToggleLeft size={11} /> Status
            </label>
            <div className="flex gap-2">
              {STATUSES.map((st) => (
                <label key={st} className="cursor-pointer">
                  <input
                    {...register("status", { required: "Status tanlang" })}
                    type="radio"
                    value={st}
                    className="hidden"
                  />
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    selectedStatus === st
                      ? st === "ACTIVE"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-red-400 text-white border-red-400"
                      : "bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600"
                  }`}>
                    {st === "ACTIVE" ? "Aktiv" : "Inaktiv"}
                  </span>
                </label>
              ))}
            </div>
            {errors.status && <p className="text-xs text-red-400">{errors.status.message}</p>}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
          {loading ? "Qo'shilmoqda..." : "Mahsulot qo'shish"}
        </button>
      </form>
    </div>
  );
};

export default AddItems;