"use client";
import dynamic from "next/dynamic";

const AdminProfile = dynamic(
  () => import("@/components/AdminDashboard/Profile"),
  { ssr: false } // disable server-side rendering
);

export default function ProfilePage() {
  return <AdminProfile />;
}
