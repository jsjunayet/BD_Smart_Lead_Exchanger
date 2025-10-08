"use client";
import dynamic from "next/dynamic";

const AdminProfile = dynamic(
  () => import("@/components/AdminDashboard/Profile"),
  { ssr: false } // server-side rendering বন্ধ
);

export default function Profile() {
  return <AdminProfile />;
}
// import AdminProfile from "@/components/AdminDashboard/Profile";

// const Profile = () => {
//   return (
//     <div>
//       <AdminProfile />
//     </div>
//   );
// };

// export default Profile;
