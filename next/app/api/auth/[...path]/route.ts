import { accountAuth, accountAuthConfigured } from '@/lib/account-auth/server';

type Handler = ReturnType<ReturnType<typeof accountAuth>['handler']>['GET'];

function handler(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'): Handler {
  return async (request, context) => {
    if (!accountAuthConfigured()) {
      return Response.json(
        { message: 'La connexion est temporairement indisponible.' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    return accountAuth().handler()[method](request, context);
  };
}

export const GET = handler('GET');
export const POST = handler('POST');
export const PUT = handler('PUT');
export const DELETE = handler('DELETE');
export const PATCH = handler('PATCH');
