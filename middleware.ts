import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const isProtectedRoute = createRouteMatcher(["/store(.*)", "/admin(.*)"]);
const isStoreRoute = createRouteMatcher(["/store(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminLoginRoute = createRouteMatcher(["/admin/login"]);

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "your-secret-key-change-in-production"
);

async function checkAdminToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return false;
    }

    // Verify JWT token (this works in Edge Runtime)
    await jwtVerify(token, ADMIN_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export default clerkMiddleware(async (auth, req) => {
  // Allow access to admin login page without protection
  if (isAdminLoginRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    // Check admin routes - verify JWT token (Edge Runtime compatible)
    if (isAdminRoute(req)) {
      const isAdmin = await checkAdminToken();

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      // Admin is authenticated, allow access
      return;
    }

    // For store routes, still use Clerk authentication
    const { userId, sessionClaims } = await auth.protect();

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Check store routes - require seller role
    if (isStoreRoute(req)) {
      const metadata = sessionClaims?.metadata as { role?: string } | undefined;
      const userRole = metadata?.role || "buyer";

      // Allow access if user has seller or admin role
      // Store approval check will be done at the page component level
      if (userRole !== "seller" && userRole !== "admin") {
        // User doesn't have seller/admin role - they'll be checked at page level
        // We allow them through here, and the page component will check store status
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
