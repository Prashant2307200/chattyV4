import { useForm } from 'react-hook-form'
import { Mail, Lock, User } from 'lucide-react'; 
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useEffect, useCallback, useState, useMemo } from "react";

import useToggle from '../../hooks/useToggle';
import { useApiMutation } from '../../hooks/useApiMutation';
import { useSocketStore } from '../../store/useSocketStore';

const AuthFormFields = ({ isRegister }) => {

  const [authSchema, setAuthSchema] = useState(null);
  const [showPassword, toggleShowPassword] = useToggle(false);

  useEffect(() => {
    import('../../constants/schema.constant').then(module => {
      setAuthSchema(module[isRegister ? "registerSchema" : "loginSchema"]);
    })
  }, [isRegister]);

  const { subscribeToEvents } = useSocketStore();

  const { mutate: AuthMutation } = useApiMutation({
    keys: ["authUser"],
    path: isRegister ? "/auth/register" : "/auth/login",
    message: isRegister ? "User successfully registered!" : "User login successfull!",
    cb: data => {
      subscribeToEvents(data._id);
    }
  })

  const onSubmit = useCallback(data => {
    console.log(data)
    AuthMutation(data);
  }, [AuthMutation]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(authSchema),
    mode: 'onChange',
  });

  const MemoizedMail = useMemo(() => <Mail className="z-10 size-5 text-base-content/40" />, []);
  const MemoizedLock = useMemo(() => <Lock className="z-10 size-5 text-base-content/40" />, []);
  const MemoizedUser = useMemo(() => <User className="z-10 size-5 text-base-content/40" />, []);
  const MemoizedLoader = useMemo(() => <Loader2 className="h-5 w-5 animate-spin" />, []);
  const MemoizedPasswordIcon = useMemo(
    () => showPassword ? <EyeOff className="h-5 w-5 text-base-content/40 z-10" /> : <Eye className="h-5 w-5 text-base-content/40 z-10" />,
    [showPassword]
  );

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

          {isRegister && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {MemoizedUser}
                </div>
                <input className={`input input-bordered w-full pl-10`} placeholder='johndoe' {...register('username')} autoComplete="off" autoCapitalize="words" disabled={!authSchema} />
              </div>
              {errors.username && <span className="text-error">{errors.username.message}</span>}
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {MemoizedMail}
              </div>
              <input className={`input input-bordered w-full pl-10`} placeholder='you@example.com' type="email" {...register('email')} autoComplete="off" disabled={!authSchema} />
            </div>
            {errors.email && <span className="text-error">{errors.email.message}</span>}
          </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {MemoizedLock}
            </div>
            <input className={`input input-bordered w-full pl-10`} placeholder="••••••••" {...register('password')} type={showPassword ? "text" : "password"} autoComplete="off" disabled={!authSchema} />
            <button className="absolute inset-y-0 right-0 pr-3 flex items-center" type="button" onClick={toggleShowPassword}>
              {MemoizedPasswordIcon}
            </button>
          </div>
          {errors.password && <span className="text-error">{errors.password.message}</span>}
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              {MemoizedLoader}
              Loading...
            </>
          ) : isRegister ? "Sign up" : "Sign in"}
        </button>
      </form>
    </>
  )
}

export default memo(AuthFormFields);