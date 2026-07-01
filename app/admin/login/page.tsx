import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 lg:ml-72">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
