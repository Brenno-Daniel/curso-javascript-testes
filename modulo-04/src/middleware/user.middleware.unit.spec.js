import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { buildReq, buildNext, buildError } from 'test/builders';
import { get } from './user.middleware';
import * as service from '@/database/service';

jest.mock('@/database/service');

describe('Middleware > User', () => {
  const error = buildError(
    StatusCodes.UNPROCESSABLE_ENTITY,
    `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should forward an error when an email is NOT provided in the headers', () => {
    const req = buildReq({ headers: {} });
    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should forward an error when an email is provided in the headers but is invalid', () => {
    const req = buildReq({
      headers: { email: 'brenno @gmail.com' },
    });
    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should return an user object given a valid email is provided', async () => {
    const req = buildReq();
    const next = buildNext();
    const { email } = req.headers;
    const resolved = {
      id: 1,
      email,
    };

    jest.spyOn(service, 'findOrSave').mockResolvedValueOnce([resolved]);

    await get(req, null, next);

    expect(req.user).toBeDefined();
    expect(req.user).toEqual(resolved);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/* nothing! */);
  });

  it('should forward an error when service.findOrSave fails', async () => {
    const req = buildReq();
    const next = buildNext();

    delete req.user;

    jest
      .spyOn(service, 'findOrSave')
      .mockRejectedValueOnce('Ocorreu um erro!!!');

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('Ocorreu um erro!!!');
  });
});
