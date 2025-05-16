import { motion } from "framer-motion"; 

const MotionLines = () => {
  
  const path = "M0 0 H48 V24 H96 V48 H160";
  const height = 140;
  const width = 420;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-20 z-50"
    >
      <motion.path
        d={path}
        stroke="url(#paint0_linear)" 
      />
      <defs>
        <motion.linearGradient
          id="paint0_linear"
          initial={{
            x1: 200,
            x2: 400.5,
            y1: 0,
            y2: 0
          }}
          animate={{
            x1: -100,
            x2: -100,
            y1: 0,
            y2: 0
          }}
          transition={{
            duration: 3,
            ease: "linear",
            repeat: Infinity
          }}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2EB9DF" stopOpacity="0" />
          <stop stopColor="#2EB9DF" />
          <stop stopColor="#9E00FF" stopOpacity="0" offset="1" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}; 

export default MotionLines;
