import AxiosHelper from './axios_helper';

const ReviewAPI = {
  fetchReviews: async (userId) => {
    const res = await AxiosHelper.get(`/users/${userId}/reviews`);
    return res.data;
  },

  postReview: async (userId, rating, comment) => {
    const body = { rating, comment };
    const res = await AxiosHelper.post(`/users/${userId}/reviews`, body);
    return res.data;
  },

  fetchRating: async (userId) => {
    const res = await AxiosHelper.get(`/users/${userId}/rating`);
    return res.data;
  }
};

export default ReviewAPI;