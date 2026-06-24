// src/pages/auth/Register.jsx
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageTransition from '../../animations/pageTransitions';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { register: registerUser, loginWithGoogle, error, loading } = useAuthStore();
  const addToast = useUIStore((state) => state.addToast);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      addToast({ type: 'warning', message: 'Please agree to the terms and conditions' });
      return;
    }

    try {
      await registerUser(data.email, data.password, data.name);
      addToast({ type: 'success', message: 'Account created successfully! Welcome to NAZAKKAT.' });
      navigate('/');
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Registration failed. Please try again.' });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
      addToast({ type: 'success', message: 'Welcome to NAZAKKAT!' });
      navigate('/');
    } catch (err) {
      addToast({ type: 'error', message: 'Google sign-up failed. Please try again.' });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-brand-black-rich flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="font-serif text-3xl text-white tracking-wider">NAZAKKAT</h1>
            </Link>
            <p className="text-gray-400 mt-2">Join the world of elegance</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-white text-center mb-6">
              Create Account
            </h2>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                             text-white placeholder-gray-500 focus:border-brand-gold-500 
                             focus:outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                             text-white placeholder-gray-500 focus:border-brand-gold-500 
                             focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register('password')}
                    type="password"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                             text-white placeholder-gray-500 focus:border-brand-gold-500 
                             focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                             text-white placeholder-gray-500 focus:border-brand-gold-500 
                             focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-500 text-brand-gold-500 
                           focus:ring-brand-gold-500 bg-transparent"
                />
                <label className="text-sm text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-brand-gold-500 hover:text-brand-gold-400">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-brand-gold-500 hover:text-brand-gold-400">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isSubmitting || loading}
                disabled={!agreedToTerms}
              >
                Create Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-brand-black-rich text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Sign Up */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-gold-500 hover:text-brand-gold-400 font-medium"
            >
              Sign in
            </Link>
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { icon: '✨', text: 'Exclusive Access' },
              { icon: '🎁', text: 'Special Offers' },
              { icon: '💎', text: 'VIP Treatment' },
            ].map((benefit) => (
              <div key={benefit.text} className="text-center">
                <div className="text-2xl mb-1">{benefit.icon}</div>
                <p className="text-xs text-gray-500">{benefit.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}