export interface ActionState {
  status: "idle" | "success" | "error";
  message: string;
  data?: any;
}

export const defaultActionState: ActionState = {
  status: "idle",
  message: "",
};