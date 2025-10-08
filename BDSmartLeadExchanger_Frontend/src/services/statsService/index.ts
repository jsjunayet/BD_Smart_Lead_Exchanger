"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
export const getAllStats = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/home`, {
      method: "GET",
      next: {
        tags: ["Stats"],
      },
    });

    const data = await res.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error.message);
  }
};

export const createStats = async (data: {
  label: string;
  value: string;
}): Promise<any> => {
  const token = (await cookies())?.get("accessToken")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/home`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    revalidateTag("Stats");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
export const updateStats = async (
  id: string,
  data: { label?: string; value?: string }
) => {
  const token = (await cookies())?.get("accessToken")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/home/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deletedStats = async (id: string): Promise<any> => {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/home/${id}`, {
      method: "DELETE", // এখানে DELETED নয়, DELETE ব্যবহার করতে হবে
      headers: {
        Authorization: `${token}`, // Bearer token সাধারণ practice
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete submission");
    }

    const result = await res.json();
    revalidateTag("Stats");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
