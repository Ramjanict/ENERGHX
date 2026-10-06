import home1 from "@/assets/images/home1.png";
import home2 from "@/assets/images/home2.png";
import home3 from "@/assets/images/home3.png";
import DashBoardHeader from "@/common/header/DashBoardHeader";
import { setUserTypeName, UserTypeName } from "@/store/auth/auth.slice";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CommonWrapper from "../common/CommonWrapper";

const Home = () => {
  const { userTypeName, user, token } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const handleSetUserType = (userType: UserTypeName) => {
    dispatch(setUserTypeName(userType));
  };

  console.log("userTypeName, user, token", userTypeName, user, token);
  return (
    <CommonWrapper>
      <section className=" w-full h-[calc(100vh-96px)] flex flex-col  items-center justify-center px-4">
        <DashBoardHeader className=" py-5 sm:pb-10  text-xs max-sm:text-center">
          SELECT YOUR PREFERRED USER-TYPE
        </DashBoardHeader>
        <div className="w-full flex gap-6 flex-wrap justify-center ">
          <Link to="/register">
            <motion.div
              className="p-6 border border-primary bg-light-green rounded-2xl  w-[200px] h-[180px] flex flex-col justify-between items-center cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: "#C3E6C0" }}
              onClick={() => handleSetUserType("CONSUMER")}
            >
              <div className="bg-[#BEE6B0] p-6 rounded-md flex justify-center items-center w-18 h-18 ">
                <img src={home2} alt="Energy User" />
              </div>
              <p className="text-primary font-normal text-[16px]">
                Energy Consumer
              </p>
            </motion.div>
          </Link>
          <Link to="/register">
            <motion.div
              className="p-6 border border-primary bg-light-green rounded-2xl  w-[200px] h-[180px] flex flex-col justify-between items-center cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: "#C3E6C0" }}
              onClick={() => handleSetUserType("SERVER")}
            >
              <div className="bg-[#BEE6B0] p-6 rounded-md flex justify-center items-center w-18 h-18">
                <img src={home3} alt="Energy Installer" />
              </div>
              <p className="text-primary font-normal text-[16px]">
                Energy Server
              </p>
            </motion.div>
          </Link>
          <Link to="/register">
            <motion.div
              className="p-6 border border-primary bg-light-green rounded-2xl w-[200px] h-[180px] flex flex-col justify-between items-center cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: "#C3E6C0" }}
              onClick={() => handleSetUserType("DEVELOPER")}
            >
              <div className="bg-[#BEE6B0] p-6 rounded-md flex justify-center items-center w-18 h-18 ">
                <img src={home1} alt="Energy Intern" className="" />
              </div>
              <p className="text-primary font-normal text-[16px]">
                Energy Developer
              </p>
            </motion.div>
          </Link>
        </div>
      </section>
    </CommonWrapper>
  );
};

export default Home;
