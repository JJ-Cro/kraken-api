import { SpotClient } from '../../src/index.js';
import { getTestProxy } from '../proxy.util.js';

describe('REST PRIVATE SPOT READ', () => {
  const account = {
    key: process.env.API_SPOT_KEY,
    secret: process.env.API_SPOT_SECRET,
  };

  const rest = new SpotClient(
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
      try {
        const res = await rest.getServerTime();

        // console.log(`server time: "${expect.getState().currentTestName}"`, res);

        expect(res).toMatchObject({
          error: [],
          result: expect.objectContaining({
            unixtime: expect.any(Number),
          }),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        expect(e).not.toBeDefined();
      }
    });
  });

  describe('private endpoints', () => {
    // TODO: no private GET endpoints?
    // describe('GET requests', () => {
    //   test('without params', async () => {
    //     try {
    //       const res = await rest.getOpenOrders();
    //       // console.log(`res "${expect.getState().currentTestName}"`, res);
    //       expect(res).toMatchObject({
    //         result: 'success',
    //         accounts: expect.any(Object),
    //       });
    //     } catch (e: any) {
    //       console.log(
    //         `err "${expect.getState().currentTestName}"`,
    //         e?.body || e,
    //       );
    //       expect(e).not.toBeDefined();
    //     }
    //   });

    //   test('with params', async () => {
    //     try {
    //       const res = await rest.getOpenOrders({
    //         trades: true,
    //         cl_ord_id: '123123123',
    //       });
    //       // console.log(`res "${expect.getState().currentTestName}"`, res);
    //       expect(res).toMatchObject({
    //         result: 'success',
    //         fills: expect.any(Array),
    //       });
    //     } catch (e: any) {
    //       console.log(
    //         `err "${expect.getState().currentTestName}"`,
    //         e?.body || e,
    //       );
    //       expect(e).not.toBeDefined();
    //     }
    //   });
    // });

    describe('POST requests', () => {
      test('without params', async () => {
        try {
          const res = await rest.getOpenOrders();
          // console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            error: [],
            result: expect.objectContaining({ open: expect.any(Object) }),
          });
        } catch (e: any) {
          console.log(
            `err "${expect.getState().currentTestName}"`,
            e?.body || e,
          );
          expect(e).not.toBeDefined();
        }
      });

      test('with params as body', async () => {
        try {
          const res = await rest.getOpenOrders({
            trades: true,
            cl_ord_id: '123123123',
          });
          // console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            error: [],
            result: expect.objectContaining({ open: expect.any(Object) }),
          });
        } catch (e: any) {
          console.log(
            `err "${expect.getState().currentTestName}"`,
            e?.body || e,
          );
          expect(e).not.toBeDefined();
        }
      });

      // test('without empty params as query', async () => {
      //   try {
      //     const res = await rest.getSpecificOrdersStatus({});

      //     // console.log(`res "${expect.getState().currentTestName}"`, res);
      //     expect(res).toMatchObject({
      //       result: 'success',
      //       orders: expect.any(Array),
      //     });
      //   } catch (e: any) {
      //     // console.log(`err "${expect.getState().currentTestName}"`, e?.body);
      //     const responseBody = e?.body;
      //     expect(responseBody).toBeUndefined();
      //   }
      // });

      // test('with params as query', async () => {
      //   try {
      //     const res = await rest.getSpecificOrdersStatus({
      //       orderIds: ['a02ed7b1-096f-4629-877c-24749fab6560'],
      //     });

      //     console.log(`res "${expect.getState().currentTestName}"`, res);
      //     expect(res).toMatchObject({
      //       result: 'success',
      //       orders: expect.any(Array),
      //     });
      //   } catch (e: any) {
      //     // console.log(`err "${expect.getState().currentTestName}"`, e?.body);
      //     const responseBody = e?.body;
      //     expect(responseBody).toBeUndefined();
      //   }
      // });

      // test('with multiple values in list params', async () => {
      //   try {
      //     const res = await rest.getSpecificOrdersStatus({
      //       orderIds: [
      //         'a02ed7b1-096f-4629-877c-24749fab6560',
      //         'a030cb03-cbf9-4e56-9a7d-cd072873760a',
      //       ],
      //     });

      //     console.log(`res "${expect.getState().currentTestName}"`, res);
      //     expect(res).toMatchObject({
      //       result: 'success',
      //       orders: expect.any(Array),
      //     });
      //   } catch (e: any) {
      //     // console.log(`err "${expect.getState().currentTestName}"`, e?.body);
      //     const responseBody = e?.body;
      //     expect(responseBody).toBeUndefined();
      //   }
      // });

      it('should throw exceptions (bad request)', async () => {
        try {
          const res = await rest.addOrder({
            fasdfafs: true,
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
            error: expect.any(Array),
          });
        }
      });

      // TODO: dummy order request with read-only keys
      // These are deliberatly restricted API keys. If the response is a permission error, it confirms the sign + request was OK and permissions were denied.
    });

    // describe('DELETE requests', () => {
    //   test('without any parameters', async () => {
    //     try {
    //       const res = await rest.cancelHFAllOrders();

    //       // console.log(`res "${expect.getState().currentTestName}"`, res);
    //       expect(res).toMatchObject({
    //         whatever: true,
    //       });
    //     } catch (e: any) {
    //       // These are deliberatly restricted API keys. If the response is a permission error, it confirms the sign + request was OK and permissions were denied.
    //       console.log(`err "${expect.getState().currentTestName}"`, e?.body);
    //       const responseBody = e?.body;
    //       expect(responseBody).toMatchObject({
    //         code: '400007',
    //         msg: expect.stringContaining('more permission'),
    //       });
    //     }
    //   });

    //   test('with params', async () => {
    //     try {
    //       const res = await rest.cancelStopOrderById({
    //         orderId: '1234567',
    //       });

    //       // console.log(`res "${expect.getState().currentTestName}"`, res);
    //       expect(res).toMatchObject({
    //         whatever: true,
    //       });
    //     } catch (e: any) {
    //       // These are deliberatly restricted API keys. If the response is a permission error, it confirms the sign + request was OK and permissions were denied.
    //       console.log(`err "${expect.getState().currentTestName}"`, e?.body);
    //       const responseBody = e?.body;
    //       expect(responseBody).toMatchObject({
    //         code: '400007',
    //         msg: expect.stringContaining('more permission'),
    //       });
    //     }
    //   });
    // });
  });
});
