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

  describe('POST write operations', () => {
    it('should succeed or fail with permission error calling submitOrder', async () => {
      try {
        const res = await rest.submitOrder({
          symbol: 'PF_XBTUSD',
          orderType: 'lmt',
          side: 'buy',
          size: 1,
          limitPrice: 10000,
        });

        console.log(`res "${expect.getState().currentTestName}"`, res);
        // If it succeeds, that's fine too (means we have full permissions)
        expect(res).toMatchObject({
          result: 'success',
          serverTime: expect.any(String),
          sendStatus: {
            status: 'insufficientAvailableFunds',
            order_id: expect.any(String),
            receivedTime: expect.any(String),
            orderEvents: expect.any(Array),
          },
        });
      } catch (e: any) {
        // Expected with read-only API keys or insufficient balance - validates signature is correct
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        const responseBody = e?.body;
        expect(responseBody).toMatchObject({
          result: 'error',
          error: expect.stringContaining('Permission denied'),
        });
      }
    });

    it('should succeed calling cancelAllOrders', async () => {
      try {
        const res = await rest.cancelAllOrders();

        // console.log(`res "${expect.getState().currentTestName}"`, res);
        expect(res).toMatchObject({
          result: 'success',
          cancelStatus: expect.any(Object),
        });
      } catch (e: any) {
        // Expected with read-only API keys or insufficient balance - validates signature is correct
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        const responseBody = e?.body;
        expect(responseBody).toMatchObject({
          result: 'error',
          error: expect.stringContaining('Permission denied'),
        });
      }
    });

    it('should handle cancelOrder with non-existent order', async () => {
      try {
        const res = await rest.cancelOrder({
          order_id: 'a068cbe2-bd99-4312-bc10-072e90ba4696',
        });

        console.log(`res "${expect.getState().currentTestName}"`, res);
        // If it succeeds somehow, that's fine
        expect(res).toMatchObject({
          result: 'success',
        });
      } catch (e: any) {
        // Expected with read-only API keys or insufficient balance - validates signature is correct
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        const responseBody = e?.body;
        expect(responseBody).toMatchObject({
          result: 'error',
          error: expect.stringContaining('Permission denied'),
        });
      }
    });

    it('should succeed calling submitWalletTransfer with invalid params (validates signature)', async () => {
      try {
        const res = await rest.submitWalletTransfer({
          fromAccount: 'cash',
          toAccount: 'flex',
          unit: 'BTC',
          amount: '0.0001',
        });

        console.log(`res "${expect.getState().currentTestName}"`, res);
        // If it succeeds, that's fine
        expect(res).toMatchObject({
          result: 'success',
        });
      } catch (e: any) {
        // Expected with read-only API keys or insufficient balance - validates signature is correct
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        const responseBody = e?.body;
        expect(responseBody).toMatchObject({
          result: 'error',
          error: expect.stringContaining('InsufficientFunds'),
        });
      }
    });
  });

  describe('PUT write operations', () => {
    it('should succeed calling setPnlPreference', async () => {
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
        // Expected with read-only API keys or insufficient balance - validates signature is correct
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        const responseBody = e?.body;
        expect(responseBody).toMatchObject({
          result: 'error',
          error: expect.stringContaining('Permission denied'),
        });
      }
    });

    it('should fail setPnlPreference with invalid symbol', async () => {
      try {
        const res = await rest.setPnlPreference({
          symbol: 'INVALID_SYMBOL',
          pnlPreference: 'USD',
        });

        console.log(`res "${expect.getState().currentTestName}"`, res);
        // Should not succeed
        expect(res).not.toBeDefined();
      } catch (e: any) {
        // Expected with read-only API keys or insufficient balance - validates signature is correct
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        const responseBody = e?.body;
        expect(responseBody).toMatchObject({
          result: 'error',
          error: expect.stringContaining('Permission denied'),
        });
      }
    });

    it('should succeed calling updateSelfTradeStrategy', async () => {
      try {
        const res = await rest.updateSelfTradeStrategy({
          strategy: 'CANCEL_MAKER_SELF',
        });

        // console.log(`res "${expect.getState().currentTestName}"`, res);
        expect(res).toMatchObject({
          result: 'success',
          strategy: 'CANCEL_MAKER_SELF',
        });
      } catch (e: any) {
        // Expected with read-only API keys or insufficient balance - validates signature is correct
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        const responseBody = e?.body;
        expect(responseBody).toMatchObject({
          result: 'error',
          error: expect.stringContaining('Permission denied'),
        });
      }
    });
  });

  describe('DELETE write operations', () => {
    it('should fail deleteAssignmentPreference with non-existent ID (validates signature)', async () => {
      try {
        const res = await rest.deleteAssignmentPreference({
          id: 999999,
        });

        console.log(`res "${expect.getState().currentTestName}"`, res);
        // If it somehow succeeds, that's fine
        expect(res).toMatchObject({
          result: 'success',
        });
      } catch (e: any) {
        // Expected with read-only API keys or insufficient balance - validates signature is correct
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        const responseBody = e?.body;
        expect(responseBody).toMatchObject({
          result: 'error',
          error: expect.stringContaining('Permission denied'),
        });
      }
    });
  });
});
