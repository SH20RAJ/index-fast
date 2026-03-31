import { Webhooks } from "@dodopayments/nextjs";
import { getDodoWebhookSecret } from "@/lib/payments/dodo";
import { applyDodoWebhookPayload } from "@/lib/services/dodo-webhook-service";

export const POST = Webhooks({
  webhookKey: getDodoWebhookSecret(),
  onPayload: async (payload) => {
    await applyDodoWebhookPayload(payload);
  },
});
