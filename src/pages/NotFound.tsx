import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#7A20A2] to-[#7A20A2]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-2xl border-0 bg-white/90">
          <CardContent className="py-12 flex flex-col items-center gap-6">
            <div className="text-[5rem] font-black text-[#7A20A2] drop-shadow-lg">
              404
            </div>
            <h1 className="text-3xl font-bold text-[#7A20A2] mb-2">
              Page Not Found
            </h1>
            <p className="text-center text-base text-gray-500 mb-6">
              Sorry, the page you’re looking for doesn’t exist.
              <br />
              Please check the URL or return to the home page.
            </p>
            <Link
              to={"/"}
              className="bg-[#2dad00] hover:bg-[#269500] text-white font-bold px-8 py-3 rounded-full text-lg shadow-md transition-all"
            >
              Go Home
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
