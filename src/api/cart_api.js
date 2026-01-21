import AxiosHelper from './axios_helper';

const CartAPI = {
  checkout: async (items) => {
    const res = await AxiosHelper.post('/cart/checkout', items);
    return res.data;
  }
};

export default CartAPI;