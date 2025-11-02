import { motion } from "framer-motion";
import { Ghost, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-gradient-to-b from-gray-50 to-gray-200 text-center p-6">
      {/* Floating ghost animation */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center mb-6"
      >
        <Ghost size={100} className="text-red-600 drop-shadow-lg" />
      </motion.div>

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-6xl font-extrabold text-red-700 mb-2"
      >
        Ho, Hey!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl text-gray-800"
      >
        How did you get here?
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-gray-600 mb-8"
      >
        You shouldn’t try your luck with random URLs 👀
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.history.back()}
        className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-red-700 transition"
      >
        <ArrowLeft size={20} />
        Back to safety
      </motion.button>
    </div>
  );
}
