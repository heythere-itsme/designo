import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isByPassableRoute = [
    "/api/polar/webhook",
    "/api/inngest(.*)",
    "/api/auth(.*)",
    "/convex(.*)"
]

const isPublicRoute = [
    "/auth(.*)",
    "/"
]

const isProtectedMatcher = [
    '/dashboard(.*)'
]

const PublicMatcher = createRouteMatcher(isPublicRoute);
const ByPassMatcher = createRouteMatcher(isByPassableRoute);
const ProtectedMatcher = createRouteMatcher(isProtectedMatcher);
 
export default convexAuthNextjsMiddleware( async (request, {convexAuth}) => {
    if(ByPassMatcher(request)) return
    const authed = await convexAuth.isAuthenticated();

    if(PublicMatcher(request) && authed) {
        return nextjsMiddlewareRedirect(request, '/dashboard')
    }

    if(ProtectedMatcher(request) && !authed) {
        return nextjsMiddlewareRedirect(request, '/auth/sign-in')
    }
    return
}, {
    cookieConfig: {maxAge: 60*60*24*30},
}
);
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};