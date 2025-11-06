import { DerivativesClient } from '../../src/index.js';
import { getTestProxy } from '../proxy.util.js';

describe('REST PRIVATE FUTURES WRITE', () => {
  const account = {
    key: process.env.API_FUTURES_WRITE_KEY,
    secret: process.env.API_FUTURES_WRITE_SECRET,
  };

  const rest = new DerivativesClient(
    {
      apiKey: account.key,
      apiSecret: account.secret,
    },
    getTestProxy(),
  );

  it('should have credentials to test with', () => {
    expect(account.key).toBeDefined();
    expect(account.secret).toBeDefined();
  });

  describe('public endpoints', () => {
    it('should succeed making a GET request', async () => {
      const res = await rest.getTradeHistory({ symbol: 'PF_XBTUSD' });

      expect(res.history).toMatchObject(expect.any(Array));
    });
  });

  describe('private endpoints', () => {
    describe.skip('POST requests', () => {
      test('with params as query', async () => {
        try {
          const res = await rest.getOrderStatus({
            orderIds: ['a02ed7b1-096f-4629-877c-24749fab6560'],
          });

          console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            orders: expect.any(Array),
          });
        } catch (e: any) {
          console.log(`err "${expect.getState().currentTestName}"`, e?.body);
          const responseBody = e?.body;
          expect(responseBody).toBeUndefined();
        }
      });

      it.skip('should throw exceptions (bad request)', async () => {
        try {
          const res = await rest.getOrderStatus({
            orderIds: [
              'a02ed7b1-096f-4629-877c-24749fab6560',
              // bad request because order GUID is unusually long
              'a030cb03-cbf9-4e56-9a7d-cd072873760a11111111',
            ],
          });

          console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            orders: expect.any(Array),
          });
        } catch (e: any) {
          // console.log(`err "${expect.getState().currentTestName}"`, e?.body);
          const responseBody = e?.body;
          expect(responseBody).toMatchObject({
            errors: expect.any(Array),
            result: 'error',
            status: 'BAD_REQUEST',
            serverTime: expect.any(String),
          });
        }
      });

      // TODO: dummy order request with read-only keys
      // These are deliberatly restricted API keys. If the response is a permission error, it confirms the sign + request was OK and permissions were denied.
    });

    describe('PUT requests', () => {
      test('with params as query', async () => {
        try {
          const res = await rest.setPnlPreference({
            symbol: 'PF_XBTUSD',
            pnlPreference: 'USD',
          });

          // console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            serverTime: expect.any(String),
          });
        } catch (e: any) {
          console.log(
            `err "${expect.getState().currentTestName}"`,
            e?.body || e,
          );
          const responseBody = e?.body;
          expect(responseBody).toBeUndefined();
        }
      });

      it('should throw exceptions (bad request)', async () => {
        try {
          const res = await rest.setPnlPreference({
            symbol: 'ASDFLAMKDFAF',
            pnlPreference: 'LKMALDSKFMD',
          });

          console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            orders: expect.any(Array),
          });
        } catch (e: any) {
          // console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
          const responseBody = e?.body;
          expect(responseBody).toMatchObject({
            errors: [{ code: 87, message: 'CONTRACT_DOES_NOT_EXIST' }],
            result: 'error',
            status: 'NOT_FOUND',
            serverTime: expect.any(String),
          });
        }
      });
    });

    // describe('DELETE requests', () => {
    //   test('with params in path', async () => {
    //     try {
    //       const res = await rest.cancelRFQOffer({
    //         rfqUid: '12312312',
    //       });

    //       console.log(`res "${expect.getState().currentTestName}"`, res);
    //       expect(res).toMatchObject({
    //         result: 'success',
    //         serverTime: expect.any(String),
    //       });
    //     } catch (e: any) {
    //       console.log(
    //         `err "${expect.getState().currentTestName}"`,
    //         e?.body || e,
    //       );
    //       const responseBody = e?.body;
    //       expect(responseBody).toBeUndefined();
    //     }
    //   });

    //   it.skip('should throw exceptions (bad request)', async () => {
    //     try {
    //       const res = await rest.cancelRFQOffer({
    //         rfqUid: '12312312',
    //       } as any);

    //       console.log(`res "${expect.getState().currentTestName}"`, res);
    //       expect(res).toMatchObject({
    //         result: 'success',
    //         orders: expect.any(Array),
    //       });
    //     } catch (e: any) {
    //       // console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
    //       const responseBody = e?.body;
    //       expect(responseBody).toMatchObject({
    //         errors: [{ code: 87, message: 'CONTRACT_DOES_NOT_EXIST' }],
    //         result: 'error',
    //         status: 'NOT_FOUND',
    //         serverTime: expect.any(String),
    //       });
    //     }
    //   });
    // });
  });
});
