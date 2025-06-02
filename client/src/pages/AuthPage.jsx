import useToggle from '../hooks/useToggle';
import Logo from '../components/ui/AppLogo';
import AuthFormFields from '../components/Auth/AuthFormFields';

import { List } from '../components/ui/List';
import { styles } from '../constants/style.constant';
import { authForm } from "../constants/auth.constant"
import MotionLines from '../components/ui/MotionLines';
import { useSocketStore } from '../store/useSocketStore';
import { MutationProvider } from '../providers/MutationProvider';

const AuthPage = () => {

  const [isRegister, toggleIsRegister] = useToggle();
  const { subscribeToEvents } = useSocketStore();

  const { form, authImagePattern } = authForm[isRegister ? "register":"login"];

  return (
    <main className="h-[100svh] grid lg:grid-cols-2 overflow-hidden">

      {/* auth form  */}
      <section className="flex flex-col justify-center items-center p-6 sm:p-12">

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
          <MutationProvider
            path={isRegister ? "/auth/register" : "/auth/login"}
            keys={["authUser"]}
            message={isRegister ? "User successfully registered!" : "User login successful!"}
            errorMessage="Failed to authenticate user"
            cb={data => subscribeToEvents(data._id)}
          >
            <AuthFormFields isRegister={isRegister} />
          </MutationProvider>

          {/* footer */}
          <div className="text-center">
            <p className={styles.subtitle}>
              {form?.suggestion}{" "}
              <span className="link link-primary" onClick={toggleIsRegister}>
                {form?.suggestionHighlight}
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