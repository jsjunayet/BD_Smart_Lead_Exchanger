"use server";
import { jwtDecode } from "jwt-decode";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
// import { FieldValues } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SignUpUser = async (userData: Record<string, any>) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ only for JSON
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    console.log(res);

    if (result?.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
      (await cookies()).set("refreshToken", result?.data?.refreshToken);

      revalidateTag("loginUser");
    }

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error);
  }
};

// export const dashbaordOverview = async (): Promise<any> => {
//   const token = (await cookies()).get("accessToken")!.value;

//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API}/user/admin/metadata`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         next: {
//           tags: ["loginUser", "post", "category"],
//         },
//       }
//     );

//     const result = await res.json();
//     return result;
//   } catch (error: any) {
//     throw new Error(error.message || "Something went wrong");
//   }
// };

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  console.log(accessToken);
  let decodedData = null;

  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    console.log(decodedData);
    return decodedData;
  } else {
    return null;
  }
};

export const logout = async () => {
  (await cookies()).delete("accessToken");
  revalidateTag("loginUser");
};
export const ForgetPassword = async (userData: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/forget-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await res.json();

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error);
  }
};

export const ChangePassword = async (userData: FieldValues) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth//change-password/changes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await res.json();

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error);
  }
};
export const ResetPassword = async (userData: FieldValues, token: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // pass token in header
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to reset password",
      };
    }

    return { success: true, message: result.message, data: result.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }
};
export const getNewToken = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (await cookies()).get("refreshToken")!.value
          }`,
        },
      }
    );

    return res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error);
  }
};
