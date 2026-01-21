import AxiosHelper from './axios_helper';

const CartAPI = {
  checkout: async (items) => {
    const res = await AxiosHelper.post('/cart/checkout', items);
    return res.data;
  },

  fetchMyOrders: async () => {
    const res = await AxiosHelper.get("/orders/mine");
    return res.data;
  },

  fetchMySales: async () => {
    const res = await AxiosHelper.get("/orders/sales");
    return res.data;
  }
};

export default CartAPI;