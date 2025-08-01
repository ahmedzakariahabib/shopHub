// import { NextResponse } from "next/server";
// import getRole from "./_components/getRole";

// function getUserRoleFromToken(token) {
//   if (!token) return null;
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.role || null;
//   } catch (err) {
//     return null;
//   }
// }

// export function middleware(request) {
//   const token = getRole().token;
//   const userRole = getUserRoleFromToken(token);
//   const { pathname } = request.nextUrl;

//   const getrole = getRole().role;

//   console.log(pathname);
//   // No token? Redirect to login
//   if (!token) {
//     return NextResponse.redirect(new URL("/auth/signin", request.url));
//   }

//   // Role checks (only JWT-based in middleware)
//   if (pathname.startsWith("/admin") && userRole !== "admin") {
//     if (pathname.startsWith("/admin") && getrole !== "admin") {
//       return NextResponse.redirect(new URL("/not-authorized", request.url));
//     }
//   }

//   if (pathname.startsWith("/user") && userRole !== "user") {
//     if (pathname.startsWith("/user") && getrole !== "user") {
//       return NextResponse.redirect(new URL("/not-authorized", request.url));
//     }
//   }

//   return NextResponse.next();
// }
