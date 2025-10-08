"use server";
import { getTenant } from "./tenant";

export async function fetchStore() {
  const tenant = await getTenant();
  if (!tenant) throw new Error("Tenant missing");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/me`, {
    headers: { "x-tenant": tenant },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed store fetch");
  return res.json() as Promise<{
    id: string;
    subDomain: string;
    name: string;
    welcome?: string;
    theme: {
      primary: string;
      background: string;
      fontFamily: string;
    };
  }>;
}

export async function createStore(
  subDomain: string,
  name: string,
  welcome: string,
  primary: string,
  background: string,
  fontFamily: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subDomain,
      name,
      welcome,
      primary,
      background,
      fontFamily,
    }),
  });
  const data = await res.json();
  if (res.ok) {
    return {
      success: true,
      message: "Store Created Successfully",
      data,
    };
  } else {
    return {
      success: false,
      message: data.message,
    };
  }
}

export async function login(tenant: string, email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(tenant ? { "x-tenant": tenant } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    return {
      success: true,
      message: "Logged in Successfully",
      data,
    };
  } else {
    return {
      success: false,
      message: data.message,
    };
  }
}

export async function signUp(tenant: string, email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(tenant ? { 'x-tenant': tenant } : {}) },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (res.ok) {
    return {
      success: true,
      message: 'Signed up Successfully',
      data,
    }
  } else {
    return {
      success: false,
      message: data.message,
    }
  }
}