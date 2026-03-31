export interface ActionState {
  status: "idle" | "success" | "error";
  message: string;
}

export const defaultActionState: ActionState = {
  status: "idle",
  message: "",
};