import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

import { authSchema } from '../../constants/schema.constant';

import useToggle from '../../hooks/useToggle';

const AuthFormFields = ({ isRegister, mutation: AuthMutation }) => {

  const [showPassword, toggleShowPassword] = useToggle(false);

  const onSubmit = data => {
    AuthMutation.mutate(data);
  };

  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
    resolver: zodResolver(authSchema[isRegister ? "registerSchema":"loginSchema"]),
    mode: 'onChange',
  });

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
                <User className="z-10 size-5 text-base-content/40" />
              </div>
              <input className={`input input-bordered w-full pl-10`} placeholder='johndoe' {...register('username')} autoComplete="off" autoCapitalize="words" />
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
              <Mail className="z-10 size-5 text-base-content/40" />
            </div>
            <input className={`input input-bordered w-full pl-10`} placeholder='you@example.com' type="email" {...register('email')} autoComplete="off" />
          </div>
          {errors.email && <span className="text-error">{errors.email.message}</span>}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="z-10 size-5 text-base-content/40" />
            </div>
            <input className={`input input-bordered w-full pl-10`} placeholder="••••••••" {...register('password')} type={showPassword ? "text" : "password"} autoComplete="off" />
            <button className="absolute inset-y-0 right-0 pr-3 flex items-center" type="button" onClick={toggleShowPassword}>
              {showPassword ? <EyeOff className="h-5 w-5 text-base-content/40 z-10" /> : <Eye className="h-5 w-5 text-base-content/40 z-10" />}
            </button>
          </div>
          {errors.password && <span className="text-error">{errors.password.message}</span>}
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : isRegister ? "Sign up" : "Sign in"}
        </button>
      </form>
    </>
  )
}

export default AuthFormFields;