"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

//  get all posts
export const getAllPaymentSetup = async () => {
  const token = (await cookies()).get("accessToken")!.value;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/bkash`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ["PaymentSetup"],
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
export const createPaymentSetup = async (formdata: any): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/bkash`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    });
    const result = await res.json();
    revalidateTag("PaymentSetup");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const UpdatePaymentSetup = async (
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Promise<any> => {
  console.log(data, id, "servere");
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/bkash/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: ` Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    revalidateTag("PaymentSetup");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deletedPaymentSetup = async (id: string): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/bkash/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: ` Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    revalidateTag("PaymentSetup");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
