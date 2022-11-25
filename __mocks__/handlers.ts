import { rest } from 'msw';
import { mockFetchDataBooks, mockFetchDataRefresh, mockFetchDataSignIn } from '.';
import constants from '../src/constants';

export const handlers = [
  rest.get(`${constants.BASE_URL}/books`, (req, res, ctx) => {
    const search: string = req.url.searchParams.get('title') || '';
    return search.includes('error')
      ? res(
          ctx.status(401),
          ctx.json({
            errorMessage: `Error 401`
          })
        )
      : res(ctx.json(mockFetchDataBooks));
  }),
  rest.post(`${constants.BASE_URL}/auth/sign-in`, async (req, res, ctx) => {
    const { email } = await req.json();
    return email.includes('error')
      ? res(
          ctx.status(401),
          ctx.json({
            errorMessage: `Error 401`
          })
        )
      : res(ctx.json(mockFetchDataSignIn));
  }),
  rest.post(`${constants.BASE_URL}/auth/refresh-token`, async (req, res, ctx) => {
    const { refreshToken } = await req.json();
    return refreshToken.includes('error')
      ? res(
          ctx.status(401),
          ctx.json({
            errorMessage: `Error 401`
          })
        )
      : res(ctx.json(mockFetchDataRefresh));
  })
];
