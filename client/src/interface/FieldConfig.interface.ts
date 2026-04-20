import type { RegisterForm } from "../schema/authForm";

export default interface FieldConfig {
  name: keyof RegisterForm;
  placeholder: string;
  type: string;
  icon: React.ReactNode;
}