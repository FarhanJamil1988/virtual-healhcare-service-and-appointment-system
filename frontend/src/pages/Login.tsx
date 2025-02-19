// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';

// interface LoginFormInputs {
//   email: string;
//   password: string;
// }

// const Login: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormInputs>();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const onSubmit = async (data: LoginFormInputs) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       // TODO: Implement actual login logic here
//       console.log('Login data:', data);
//       navigate('/patient/dashboard');
//     } catch (err) {
//       setError('Invalid email or password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full">
//         {/* Logo and Title */}
//         <div className="text-center mb-8">
//           <img
//             className="mx-auto h-12 w-auto"
//             src="/logo.svg"
//             alt="Your Logo"
//           />
//           <h2 className="mt-6 text-3xl font-bold text-white">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-sm text-gray-400">
//             Or{' '}
//             <Link
//               to="/register"
//               className="font-medium text-emerald-500 hover:text-emerald-400"
//             >
//               create a new account
//             </Link>
//           </p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {error && (
//               <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-300"
//               >
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   {...register('email', {
//                     required: 'Email is required',
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: 'Invalid email address',
//                     },
//                   })}
//                   type="email"
//                   className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
//                   placeholder="you@example.com"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-400">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-300"
//               >
//                 Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   {...register('password', {
//                     required: 'Password is required',
//                     minLength: {
//                       value: 6,
//                       message: 'Password must be at least 6 characters',
//                     },
//                   })}
//                   type="password"
//                   className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
//                   placeholder="••••••••"
//                 />
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-400">
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
//                 />
//                 <label
//                   htmlFor="remember-me"
//                   className="ml-2 block text-sm text-gray-300"
//                 >
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <Link
//                   to="/forgot-password"
//                   className="font-medium text-emerald-500 hover:text-emerald-400"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login; 