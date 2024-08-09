import {  clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const isProtecteddRoute = createRouteMatcher(['/buttons(.*)']);



export default clerkMiddleware((auth, req)=>{

  if(isProtecteddRoute(req)) auth().protect();

});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};