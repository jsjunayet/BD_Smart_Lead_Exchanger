"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

//  get all posts
export const getAllReportService = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reports`, {
      method: "GET",
      next: {
        tags: ["ReportService"],
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
export const createReportService = async (formdata): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reports`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    });
    const result = await res.json();
    revalidateTag("ReportService");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const UpdateReportService = async (id: string, data): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/reports/status/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await res.json();
    revalidateTag("ReportService");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OwnReportService = async (): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/reports/my/reports`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    // revalidateTag("ReportService");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
