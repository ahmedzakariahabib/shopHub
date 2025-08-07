import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const accessControl = {
  //admin access
  "/products/addProduct": ["admin"],
  "/products/editProduct": ["admin"],
  "/brands/addBrand": ["admin"],
  "/brands/editBrand": ["admin"],
  "/categories/addCategory": ["admin"],
  "/categories/editCategory": ["admin"],
  "/subcategories/addSubCategory": ["admin"],
  "/subcategories/editSubCategory": ["admin"],
  "/coupons": ["admin"],
  "/coupons/addCoupon": ["admin"],
  "/coupons/couponDetails": ["admin"],
  "/coupons/editCoupn": ["admin"],
  "/orders/allOrders": ["admin"],
  "/users": ["admin"],
  "/users/addUser": ["admin"],
  "/editUser": ["admin"],
  "/userDetails": ["admin"],

  //user access
  "/carts": ["user"],
  "/wishlist": ["user"],
  "/address": ["user"],
  "/createOrder": ["user"],
  "/orders/order": ["user"],
  "/addReview": ["user"],
  "/editReview": ["user"],

  //user admin
  "/products/productDetails": ["admin", "user"],
  "/brands/brandDetails": ["admin", "user"],
  "/categories/categoriesDetails": ["admin", "user"],
  "/subcategories": ["admin", "user"],
  "/subcategories/subcategoriesDetails": ["admin", "user"],
  "/settings": ["admin", "user"],
};

export async function middleware(request) {
  const url = request.nextUrl;

  try {
    // Get token from cookie
    const token = request.cookies.get("token")?.value;

    if (!token) {
      console.log("❌ No token found");
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Decode JWT token to get role dynamically
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const role = payload.role || payload.user?.role;

    if (!role) {
      console.log("❌ No role found in token");
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Check access control
    for (const path in accessControl) {
      if (url.pathname.startsWith(path)) {
        const allowedRoles = accessControl[path];
        if (!allowedRoles.includes(role)) {
          console.log(
            `❌ Access denied for role: ${role} on path: ${url.pathname}`
          );
          return NextResponse.redirect(new URL("/auth/signin", request.url));
        }
      }
    }

    console.log(`✅ Access granted for role: ${role}`);
    return NextResponse.next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: [
    // Admin paths
    "/products/addProduct",
    "/products/editProduct/:path*",
    "/brands/addBrand",
    "/brands/editBrand/:path*",
    "/categories/addCategory",
    "/categories/editCategory/:path*",
    "/subcategories/addSubCategory",
    "/subcategories/editSubCategory/:path*",
    "/coupons/:path*",
    "/orders/allOrders",
    "/users/:path*",
    "/editUser/:path*",
    "/userDetails/:path*",

    // User paths
    "/carts",
    "/wishlist",
    "/address",
    "/createOrder",
    "/orders/order",
    "/addReview",
    "/editReview/:path*",

    // Shared paths

    "/products/productDetails/:path*",
    "/brands/brandDetails/:path*",
    "/categories/categoriesDetails/:path*",
    "/subcategories/:path*",
    "/subcategories/subcategoriesDetails/:path*",
    "/settings",
  ],
};
