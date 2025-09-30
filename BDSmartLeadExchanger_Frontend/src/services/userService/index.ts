"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

//  get all posts
export const getAlluser = async () => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/admin/get-all`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["user"],
        },
      }
    );

    const data = await res.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error.message);
  }
};
export const getSingleuser = async () => {
  const token = (await cookies())?.get("accessToken")?.value || "";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/user/get-single`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["user"],
        },
      }
    );

    const data = await res.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error.message);
  }
};
export const getDashboardData = async () => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["user"],
        },
      }
    );

    const data = await res.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error.message);
  }
};
export const UpdateProfile = async (userData: Record<string, any>) => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/profile-edit`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
        },
        body: userData,
      }
    );

    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// create post
// export const createuser = async (name: string): Promise<any> => {
//   const token = (await cookies()).get("accessToken")!.value;

//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/create`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name }),
//     });
//     const result = await res.json();
//     revalidateTag("user");
//     return result;
//   } catch (error: any) {
//     throw new Error(error.message || "Something went wrong");
//   }
// };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Approveduser = async (id: string, data: string): Promise<any> => {
  console.log(data, id, "servere");
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/admin/approved/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      }
    );
    const result = await res.json();
    revalidateTag("user");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
export const userRoleUpate = async (id: string, data): Promise<any> => {
  console.log(data, id, "servere");
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/admin/role/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await res.json();
    revalidateTag("user");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const deleteduser = async (id: string): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/admin/user-deleted/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    revalidateTag("user");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
