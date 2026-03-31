"use client";

import { useActionState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { updateAccountEmailAction } from "@/app/(dashboard)/actions";
import { defaultActionState } from "@/app/(dashboard)/action-state";

interface AccountEmailFormProps {
  initialEmail: string;
}

export default function AccountEmailForm({ initialEmail }: AccountEmailFormProps) {
  const [state, formAction, pending] = useActionState(updateAccountEmailAction, defaultActionState);

  return (
    <Stack component="form" action={formAction} spacing={1.5}>
      <TextField
        label="Email"
        name="email"
        type="email"
        defaultValue={initialEmail}
        required
        fullWidth
      />
      <Box>
        <Button
          type="submit"
          variant="contained"
          disabled={pending}
          sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 800 }}
        >
          {pending ? "Saving..." : "Save Email"}
        </Button>
      </Box>
      {state.status !== "idle" ? (
        <Alert severity={state.status === "success" ? "success" : "error"}>{state.message}</Alert>
      ) : null}
    </Stack>
  );
}
