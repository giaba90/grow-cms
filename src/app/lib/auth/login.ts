import { createSession } from "../session";

export async function login(formData: FormData) {
  if (!process.env.NEXT_PUBLIC_API_LOGIN_URL) {
    throw new Error("NEXT_PUBLIC_API_LOGIN_URL is not defined");
  }

  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const response = await fetch(process.env.NEXT_PUBLIC_API_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  //check if the user is authenticated
  try {
    const result = await response.json();
    if (result.success) {
      await createSession(result.id);
    } else {
      console.error("Login failed:", result.message);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
}
