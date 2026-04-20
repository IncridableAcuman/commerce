import type IProduct from "./product.interface";

export default interface ProductContextType {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    products: IProduct[];
    product: IProduct | null;
    setProduct: (product:IProduct | null)=>void;
    setProducts: (product: IProduct[]) => void;
    addToCart: (id:string | undefined,quantity:number)=>void;
    fetchProduct: (id:string | undefined)=> void;
}