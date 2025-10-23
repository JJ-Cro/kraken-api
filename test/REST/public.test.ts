import { FuturesClient } from '../../src/index.js';

describe('REST PUBLIC', () => {
  const rest = new FuturesClient();

  describe('public endpoints - FuturesClient', () => {
    it('should succeed making a GET request', async () => {
      const res = await rest.getTradeHistory({ symbol: 'PF_XBTUSD' });

      expect(res.history).toMatchObject(expect.any(Array));
    });
  });
});
