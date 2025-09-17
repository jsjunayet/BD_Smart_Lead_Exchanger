"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

//  get all posts
export const getAlljobs = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/job/get-all`, {
      method: "GET",
      next: {
        tags: ["jobs"],
      },
    });

    const data = await res.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error.message);
  }
};
export const getWorkPlace = async () => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/job/get-workplace`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["jobs"],
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
export const getOwnjobs = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/job/get-own`, {
      method: "GET",
      next: {
        tags: ["jobs"],
      },
    });

    const data = await res.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error.message);
  }
};
// create post
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createjobs = async (formdata): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/job/jobPost`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: formdata,
    });
    const result = await res.json();
    revalidateTag("jobs");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const Updatejobs = async (id: string, data): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/job/jobEdit/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: ` ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await res.json();
    revalidateTag("jobs");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
export const ApprovedOrRejectJobs = async (id: string, data): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/job/action`, {
      method: "PATCH",
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("jobs");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
