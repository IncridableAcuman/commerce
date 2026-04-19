import type IProduct from "./product.interface";

export default interface ICart {
    cartItemDtoList:[
        {
            product: IProduct;
            quantity:number;
            total:number;
        }
    ]
    userId:number;
    id:number;
}