import type { RefObject } from "react";
import type ICart from "./cart.interface";

export default interface CartContextType {
    cart: ICart | null;
    openMenuId: number | null;
    setOpenMenuId: (openMenuId: number | null) => void;
    setCart: (cart: ICart | null) => void;
    handleDeleteItem: (id: number) => void;
    menuRef:RefObject<HTMLDivElement | null>;
}