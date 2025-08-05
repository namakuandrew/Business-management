// lib/supabase/utils.js
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Renamed to be more descriptive
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Renamed to be more descriptive
export function createSupabaseServerClient(cookieStore) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

// Renamed to be more descriptive
export function createSupabaseMiddlewareClient(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.remove(name, options);
        },
      },
    }
  );
  return { supabase, response };
}

// Your currency formatting function
export const formatToRupiah = (value) => {
  const numberValue = Number(value) || 0;
  const isNegative = numberValue < 0;

  const formattedValue = new Intl.NumberFormat("id-ID", {
    style: "decimal",
  }).format(Math.abs(numberValue));

  return `${isNegative ? "- " : ""}Rp ${formattedValue}`;
};
