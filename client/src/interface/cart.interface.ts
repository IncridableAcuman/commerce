import type IProduct from "./product.interface";

export default interface ICart {
    cartItemDtoList:IProduct[];
    userId:number;
    id:number;
}