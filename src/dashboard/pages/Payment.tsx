import { useLazyGetAllPaymentQuery } from "@/store/LMS/paymentAndCourse/paymentCourseApi";
import AdminCommonButton from "../Common/AdminCommonButton";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import PaymentCard from "../components/PaymentCard";

const Payment = () => {
  const [fetchPayments, { data, isLoading }] = useLazyGetAllPaymentQuery();
  const allPayment = data?.data ?? [];

  return (
    <div>
      <AdminCommonHeader>Show Payments</AdminCommonHeader>
      <AdminCommonButton
        disabled={isLoading}
        onClick={() => fetchPayments()}
        className="!w-fit"
      >
        {isLoading ? "Processing..." : "Show Payments"}
      </AdminCommonButton>
      <PaymentCard allPayment={allPayment} />
    </div>
  );
};

export default Payment;
