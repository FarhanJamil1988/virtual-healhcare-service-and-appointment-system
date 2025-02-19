import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Home from "./pages/Home";
import BookAppointment from "./pages/BookAppointment";

import DoctorDashboard from "./pages/doctor/Dashboard";

import AdminLogin from "./pages/auth/AdminLogin";
import AdminRegister from "./pages/auth/AdminRegister";
import DoctorLogin from "./pages/auth/DoctorLogin";
import DoctorRegister from "./pages/auth/DoctorRegister";
import PatientLogin from "./pages/auth/PatientLogin";
import PatientRegister from "./pages/auth/PatientRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDashboard from "./pages/patient/Dashboard";
import PatientAppointments from "./pages/patient/Appointments";
import PatientPrescriptions from "./pages/patient/Prescriptions";
import PatientProfile from "./pages/patient/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorProfile from "./pages/doctor/Profile";
import Services from "./pages/Services";
import AdminDoctors from "./pages/admin/Doctors";
import AdminPatients from "./pages/admin/Patients";
import AdminAppointments from "./pages/admin/Appointments";
import AdminSettings from "./pages/admin/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminServices from "./pages/admin/Services";
import { Toaster } from "react-hot-toast";
import PaymentStatus from "./pages/payment/PaymentStatus";
import PaymentSuccessRedirect from "./components/payment/PaymentSuccessRedirect";
import PaymentFailedRedirect from "./components/payment/PaymentFailedRedirect";
import PaymentCancelledRedirect from "./components/payment/PaymentCancelledRedirect";
import PaymentErrorRedirect from "./components/payment/PaymentErrorRedirect";
import WorkInProgress from "./pages/WorkInProgress";

const App: React.FC = () => {
  // Add a redirect for the root path based on auth state
  const getInitialRoute = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (token && user.role) {
      switch (user.role) {
        case "patient":
          return <Navigate to="/patient/dashboard" replace />;
        case "doctor":
          return <Navigate to="/doctor/dashboard" replace />;
        case "admin":
          return <Navigate to="/admin/dashboard" replace />;
        default:
          return <Home />;
      }
    }
    return <Home />;
  };

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <AuthProvider>
          <Provider store={store}>
            <Routes>
              {/* Root route with conditional redirect */}
              <Route path="/" element={getInitialRoute()} />

              {/* Public routes */}
              <Route path="/patient/login" element={<PatientLogin />} />
              <Route path="/patient/register" element={<PatientRegister />} />
              <Route path="/doctor/login" element={<DoctorLogin />} />
              <Route path="/doctor/register" element={<DoctorRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              {/* <Route path="/admin/register" element={<AdminRegister />} /> */}
              <Route path="/services" element={<Services />} />

              <Route
                path="/doctor/profile"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorProfile />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/admin/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              /> */}
              <Route
                path="/patient/*"
                element={
                  <ProtectedRoute allowedRoles={["patient"]}>
                    <Routes>
                      <Route path="dashboard" element={<PatientDashboard />} />
                      <Route
                        path="appointments"
                        element={<PatientAppointments />}
                      />
                      <Route
                        path="appointments/payment-success"
                        element={<PaymentSuccessRedirect />}
                      />
                      <Route
                        path="appointments/payment-failed"
                        element={<PaymentFailedRedirect />}
                      />
                      <Route
                        path="appointments/payment-cancelled"
                        element={<PaymentCancelledRedirect />}
                      />
                      <Route
                        path="appointments/payment-error"
                        element={<PaymentErrorRedirect />}
                      />
                      <Route
                        path="prescriptions"
                        element={<PatientPrescriptions />}
                      />
                      <Route path="profile" element={<PatientProfile />} />
                      <Route
                        path="book-appointment"
                        element={<BookAppointment />}
                      />
                      <Route path="buy-medicine" element={<WorkInProgress />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/*"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <Routes>
                      <Route path="dashboard" element={<DoctorDashboard />} />
                      <Route
                        path="appointments"
                        element={<DoctorAppointments />}
                      />
                      <Route path="patients" element={<DoctorPatients />} />
                      <Route path="profile" element={<DoctorProfile />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDoctors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/patients"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminPatients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminServices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:status/:transactionId"
                element={<PaymentStatus />}
              />
              <Route path="/payment/:status" element={<PaymentStatus />} />
            </Routes>
          </Provider>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
