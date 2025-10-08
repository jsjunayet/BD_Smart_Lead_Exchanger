"use client";
import dynamic from "next/dynamic";

const AdminProfile = dynamic(
  () => import("@/components/AdminDashboard/Profile"),
  { ssr: false } // server-side rendering বন্ধ
);

export default function ProfilePage() {
  return <AdminProfile />;
}
