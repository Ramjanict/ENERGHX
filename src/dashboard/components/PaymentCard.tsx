import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { PaymentRecord } from "@/store/LMS/paymentAndCourse/types/paymentAndAdmin";

interface PaymentCardProps {
  allPayment: PaymentRecord[];
}
const PaymentCard: React.FC<PaymentCardProps> = ({ allPayment }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
      {allPayment.map((payment) => (
        <CommonBorderWrapper key={`${payment.userId}-${payment.programId}`}>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {payment.user.firstname}
            </h2>
            <p className="text-sm text-gray-500">{payment.user.email}</p>
          </div>

          <div>
            <p className="text-lg font-medium text-gray-700 capitalize">
              {payment.program.title}
            </p>
            <p className="text-sm text-gray-500">
              Status:
              <span
                className={
                  payment.paymentStatus === "SUCCESS"
                    ? "text-green-600 font-semibold"
                    : payment.paymentStatus === "PENDING"
                      ? "text-yellow-600 font-semibold"
                      : "text-red-600 font-semibold"
                }
              >
                {payment.paymentStatus || "Unknown"}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Program status: {payment.status.toLowerCase()}
            </p>
          </div>
        </CommonBorderWrapper>
      ))}
    </div>
  );
};

export default PaymentCard;
