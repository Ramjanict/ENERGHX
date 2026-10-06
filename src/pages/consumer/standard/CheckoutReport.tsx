import Checkout from "@/components/consumer/standard/contact/checkout/Checkout";
import { PaymentMethod } from "@/components/consumer/standard/contact/checkout/types";
import {
  useCreatePaymentCheckoutMutation,
  useGetCheckoutQuery,
  useStartOrderConfirmationMutation,
} from "@/store/consumer/standard/checkout/checkoutApi";
import {
  extractCheckoutSession,
  mapOrderSummary,
  mapPaymentOptions,
  mapSelectedPaymentMethod,
} from "@/store/consumer/standard/checkout/mapCheckoutUi";
import { useMemo } from "react";

const CheckoutReport = () => {
  const { data, isLoading } = useGetCheckoutQuery();
  const [createPaymentCheckout, { isLoading: isCreatingCheckout }] =
    useCreatePaymentCheckoutMutation();
  const [startOrderConfirmation, { isLoading: isStartingConfirmation }] =
    useStartOrderConfirmationMutation();

  const paymentOptions = useMemo(() => mapPaymentOptions(data), [data]);
  const orderSummary = useMemo(() => mapOrderSummary(data), [data]);
  const initialSelectedMethod = useMemo(
    () => mapSelectedPaymentMethod(data),
    [data],
  );

  const handleCompletePurchase = async (_method: PaymentMethod) => {
    if (!data?.payment?.workflowId || !data?.payment?.proposalId) {
      console.error("Missing workflowId or proposalId for checkout");
      return;
    }

    try {
      const paymentResult = await createPaymentCheckout({
        workflowId: data.payment.workflowId,
        proposalId: data.payment.proposalId,
      }).unwrap();

      const { url, sessionId } = extractCheckoutSession(paymentResult);
      if (!sessionId) {
        console.error(
          "Payment checkout did not return a session id",
          paymentResult,
        );
        return;
      }

      await startOrderConfirmation({
        status: "CHECKOUT_STARTED",
        paymentStatus: "PENDING",
        checkoutSessionId: sessionId,
        invoiceUrl: null,
        receiptUrl: null,
        reportUrl: null,
      }).unwrap();

      if (url) {
        window.location.assign(url);
      } else if (sessionId.startsWith("http")) {
        window.location.assign(sessionId);
      }
    } catch (err) {
      console.error("Failed to complete checkout:", err);
    }
  };

  return (
    <div>
      <Checkout
        loading={isLoading}
        paymentOptions={paymentOptions}
        orderSummary={orderSummary}
        initialSelectedMethod={initialSelectedMethod}
        checkoutEnabled={Boolean(
          data?.payment?.workflowId && data?.payment?.proposalId,
        )}
        isSubmitting={isCreatingCheckout || isStartingConfirmation}
        onCompletePurchase={handleCompletePurchase}
      />
    </div>
  );
};

export default CheckoutReport;
