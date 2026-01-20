import AxiosHelper from "./axios_helper.js";

const CommentAPI = {
  fetchComments: async (productId) => {
    const res = await AxiosHelper.get(`/products/${productId}/comments`);
    return res.data;
  },

  postComment: async (productId, content) => {
    const res = await AxiosHelper.post(`/products/${productId}/comments`, { content });
    return res.data;
  },

  editComment: async (id, content) => {
    const res = await AxiosHelper.put(`/comments/${id}`, { content });
    return res.data;
  },

  deleteComment: async (id) => {
    const res = await AxiosHelper.delete(`/comments/${id}`);
    return res;
  }
};

export default CommentAPI;

