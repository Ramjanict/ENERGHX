import CommonButton from "@/common/button/CommonButton";
import { useNavigate } from "react-router-dom";

interface Props {
  backText?: string;
  continueText?: string;
  backLink?: string;
  to: string;
}
const FooterActions: React.FC<Props> = ({
  backText = "Back to Dashboard",
  continueText = "Continue to NZEB Analysis",
  backLink,
  to,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <CommonButton
        onClick={() => {
          if (backLink) {
            navigate(backLink);
          } else {
            navigate(-1);
          }
        }}
        variant="outline"
      >
        {backText}
      </CommonButton>
      <CommonButton to={to}>{continueText}</CommonButton>
    </div>
  );
};

export default FooterActions;
