import Login from "@/components/login/Login";

const LoginPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(apiUrl);

  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;
