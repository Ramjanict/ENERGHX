import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/store/auth/auth.slice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  trigger: React.ReactNode;
  onUpdatePassword?: () => void;
}

const DropDown: React.FC<Props> = ({ trigger, onUpdatePassword }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!token) return;

    try {
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`${token ? "w-40" : "w-48"} border bg-white border-[#E7E9E8] shadow-lg`}
      >
        {token && onUpdatePassword && (
          <DropdownMenuItem
            onClick={onUpdatePassword}
            className="cursor-pointer text-[#112518] hover:bg-primary/10! hover:text-primary! focus:bg-primary/10! focus:text-primary!"
          >
            Update Password
          </DropdownMenuItem>
        )}

        {token ? (
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 hover:bg-red-50! hover:text-red-700! focus:bg-red-50! focus:text-red-700!"
          >
            Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            asChild
            className="cursor-pointer text-[#112518] hover:bg-primary/10! hover:text-primary! focus:bg-primary/10! focus:text-primary!"
          >
            <Link to="/login">Login</Link>
          </DropdownMenuItem>
        )}

        {!token && (
          <DropdownMenuItem
            asChild
            className="cursor-pointer text-[#112518] hover:bg-primary/10! hover:text-primary! focus:bg-primary/10! focus:text-primary!"
          >
            <Link to="/forgot-password">Forgot Password</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDown;
