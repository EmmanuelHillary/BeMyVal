import { motion } from "framer-motion";
import loveImg from "@/assets/love.jpeg";
import loveImg2 from "@/assets/loves.jpeg";
import FallingHearts from "@/components/FallingHearts";

const YesPage = () => {
  return (
    <div className="min-h-screen celebration-gradient flex flex-col items-center justify-center relative overflow-hidden px-4">
      <FallingHearts />

      <motion.div
        className="z-10 text-center"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-primary mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          YAYYYYY!!! 🎉
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl text-foreground/80 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          I knew you'd say yes! 💕
        </motion.p>

        <motion.p
          className="text-xl text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          You just made me the happiest person ever! 🥰
        </motion.p>
      </motion.div>

      <motion.div
        className="z-10 flex flex-col md:flex-row gap-6 items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.img
          src={loveImg}
          alt="Us together"
          className="w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-xl object-cover border-4 border-primary/30"
          whileHover={{ scale: 1.05, rotate: 3 }}
        />
        <motion.img
          src={loveImg2}
          alt="Celebration"
          className="w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-xl object-cover border-4 border-primary/30"
          whileHover={{ scale: 1.05, rotate: -3 }}
        />
      </motion.div>

      <motion.div
        className="z-10 mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-lg text-muted-foreground">
          MUUUAAHHH💜💋
        </p>
        <motion.div
          className="text-5xl mt-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          💜
        </motion.div>
      </motion.div>
    </div>
  );
};

export default YesPage;
