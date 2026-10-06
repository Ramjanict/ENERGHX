import { motion } from "framer-motion";

const count = 10;

const MiniSpinner = () => {
  return (
    <div className=" flex justify-center  items-center min-h-screen  w-full ">
      <div className="relative w-20 h-20 ">
        {Array.from({ length: count }).map((_, i) => {
          const rotation = (360 / count) * i;
          const delay = i * 0.1;

          return (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-6"
              style={{
                transformOrigin: "center -30px",
                rotate: rotation,
              }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full bg-gray-500 rounded-full" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniSpinner;
