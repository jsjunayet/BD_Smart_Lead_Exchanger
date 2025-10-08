import ResetPasswordPage from "@/components/login/ResetPasswordPage";
import { Suspense } from "react";

const ResetPassword = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordPage />
  </Suspense>
);

export default ResetPassword;
