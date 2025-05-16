import { useEffect, useState, useTransition, useCallback } from 'react';

import Logo from '../components/ui/AppLogo';
import useToggle from '../hooks/useToggle';
import AuthFormFields from '../components/Auth/AuthFormFields';

import { List } from '../components/ui/List';
import PageLoader from '../components/ui/PageLoader';
import { styles } from '../constants/style.constant';
import MotionLines from '../components/ui/MotionLines';


const AuthPage = () => {

  const [isRegister, toggleIsRegister] = useToggle();
  const [isPending, startTransition] = useTransition();

  const [authForm, setAuthForm] = useState(null)

  const handleOnClick = useCallback(() => {
    startTransition(() => {
      toggleIsRegister()
    })
  }, [startTransition, toggleIsRegister])

  useEffect(() => {
    import("../constants/auth.constant").then(module => {
      setAuthForm(module[isRegister ? "register" : "login"]);
    });
  }, [isRegister]);

  if (!authForm) return <PageLoader />

  const { form, authImagePattern } = authForm;

  return (
    <main className="h-screen grid lg:grid-cols-2 overflow-hidden"> 

      {/* auth form  */}
      <section className="relative flex flex-col justify-center items-center p-6 sm:p-12">

        <MotionLines />

        {/* container */}
        <div className="w-full max-w-md space-y-8">

          {/* header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-xl ${styles.primary} flex items-center justify-center group-hover:${styles.primaryHover} transition-colors`}>
                <Logo className="w-6 h-6 text-primary" />
              </div>
              <h1 className={`${styles.title} mt-2`}>{form?.title}</h1>
              <p className={styles.subtitle}>{form?.subtitle}</p>
            </div>
          </div>

          {/* form */}
          <AuthFormFields isRegister={isRegister} />

          {/* footer */}
          <div className="text-center">
            <p className={styles.subtitle}>
              {form?.suggestion}{" "}
              <span className="link link-primary"
                disabled={isPending}
                onClick={handleOnClick}>
                {isPending ? "Loading..." : form?.suggestionHighlight}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* auth image pattern  */}
      <section className={`hidden lg:flex items-center justify-center p-12 ${styles.base}`}>
        <div className="max-w-md text-center">
          <div className="grid grid-cols-3 gap-3 mb-8">
            <List
              data={[...Array(9)]}
              getItem={(_, index) => (
                <div className={`aspect-square rounded-2xl ${styles.primary} ${index % 2 === 0 ? "animate-pulse" : ""}`} />
              )}
            />
          </div>
          <h2 className={`mb-4 ${styles.title}`}>{authImagePattern?.title}</h2>
          <p className={styles.subtitle}>{authImagePattern?.subtitle}</p>
        </div>
      </section>
    </main>
  )
}


export default AuthPage;


 

// const MotionLines = () => {
  
//   const path = "M0 0 H48 V24 H96 V48 H160";
//   const height = 140;
//   const width = 420;

//   return (
//     <svg
//       width={width}
//       height={height}
//       viewBox={`0 0 ${width} ${height}`}
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className="absolute inset-20 z-50"
//     >
//       <motion.path
//         d={path}
//         stroke="url(#paint0_linear)" 
//       />
//       <defs>
//         <motion.linearGradient
//           id="paint0_linear"
//           initial={{
//             x1: 200,
//             x2: 400.5,
//             y1: 0,
//             y2: 0
//           }}
//           animate={{
//             x1: -100,
//             x2: -100,
//             y1: 0,
//             y2: 0
//           }}
//           transition={{
//             duration: 3,
//             ease: "linear",
//             repeat: Infinity
//           }}
//           gradientUnits="userSpaceOnUse"
//         >
//           <stop stopColor="#2EB9DF" stopOpacity="0" />
//           <stop stopColor="#2EB9DF" />
//           <stop stopColor="#9E00FF" stopOpacity="0" offset="1" />
//         </motion.linearGradient>
//       </defs>
//     </svg>
//   );
// }; 