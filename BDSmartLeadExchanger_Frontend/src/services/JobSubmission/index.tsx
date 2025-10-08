"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

//  get all posts
export const getAllSubmission = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/submition/get-all-submittion`,
      {
        method: "GET",
        next: {
          tags: ["Submission"],
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

export const getOwnSubmission = async () => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/submition/get-own-submittion`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
        next: {
          tags: ["Submission"],
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
// create post
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSubmission = async (
  id: string,
  formdata: any
): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/submition/jobSubmit/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      }
    );
    const result = await res.json();
    revalidateTag("Submission");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// export const UpdateSubmission = async (id: string, data): Promise<any> => {
//   const token = (await cookies()).get("accessToken")!.value;

//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API}/job/jobEdit/${id}`,
//       {
//         method: "PATCH",
//         headers: {
//           Authorization: ` ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       }
//     );
//     const result = await res.json();
//     revalidateTag("Submission");
//     return result;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     throw new Error(error.message || "Something went wrong");
//   }
// };
export const ApprovedOrRejectSubmission = async (
  id: string,
  data: any
): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/submition/review/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: data }),
      }
    );
    const result = await res.json();
    revalidateTag("Submission");
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
