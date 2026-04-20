import type IProduct from "./product.interface";

export default interface ICart {
    cartItemDtoList:[
        {
            id: number;
            product: IProduct;
            quantity:number;
        }
    ]
    userId:number;
    id:number;
}