import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    /*
      Suojaa kaikki sivut **paitsi** API-reitit, _next/static, favicon jne.
    */
    "/((?!api|_next|static|favicon.ico).*)",
  ],
};
