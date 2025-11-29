import { Navigate, Route, Routes } from "react-router-dom";
import CreateFormPage from "./pages/CreateForm";
import PreviewPage from "./pages/Preview";
import MyFormsPage from "./pages/MyForms";
import SubmissionsPage from "./pages/Submissions";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import RoleRedirect from "./pages/RoleRedirect";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RequireAdmin } from "./components/auth/RequireAdmin";

export default function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/forms" element={<PreviewPage />} />
        <Route path="/forms/:id" element={<PreviewPage />} />
        <Route element={<RequireAdmin />}>
          <Route path="/create" element={<CreateFormPage />} />
          <Route path="/create/:id" element={<CreateFormPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
          <Route path="/myforms" element={<MyFormsPage />} />
          <Route path="/submissions/:id" element={<SubmissionsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
