import type ProductInterface from "./productInterface";

export default interface ProductContextInterface {
    product: ProductInterface | null;
    setProduct: (product: ProductInterface | null) => void;
    products: ProductInterface[];
    setProducts: (products: ProductInterface[]) => void;
    handleDelete: (id: number) => void;
    openMenuId: number | null;
    setOpenMenuId: (openMenuId: number | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    form: Partial<ProductInterface>;
    setForm: (orm: Partial<ProductInterface>) => void;
    imageFile: File | null;
    setImageFile: (imageFile: File | null) => void;
    handleEditSubmit: () => void;
    editProduct: ProductInterface | null;
    setEditProduct: (editProduct: ProductInterface | null) => void;
    closeEdit: () => void;
}