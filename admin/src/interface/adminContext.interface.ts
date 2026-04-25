import type { LoginForm } from './../../../client/src/schema/authForm';
import type { RefObject } from "react";
import type IUser from "./userInterface";

interface EditDataType{
      firstname: string ;
      lastname: string ;
      username: string;
      email: string;
      role: string;
}

export default interface AdminContextIinterface {
    users: IUser[];
    setUsers: (users: IUser[]) => void;
    showPassword: boolean;
    setShowPassword:(showPassword:boolean)=>void;
    loading: boolean;
    setLoading:(loading:boolean)=>boolean;
    openMenu: number | null;
    setOpenMenu: (openMenu: number | null) => void;
    isEditOpen:boolean;
    setIsEditOpen:(isEditOpen:boolean)=>void;
    selectedUser: IUser | null;
    setSelectedUser: (selectedUser: IUser | null)=>void;
    editData: EditDataType;
    setEditData: (editData:EditDataType)=>void;
    menuRef: RefObject<HTMLDivElement | null>;
    handleDeleteUser:(id:number)=>void;
    openEditModal:(user:IUser)=>void;
    handleEditSubmit:()=>void;
    onSubmit:(values:LoginForm)=>void;
}