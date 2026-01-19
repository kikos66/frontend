import AxiosHelper from "./axios_helper.js";

const CommentAPI = {
  fetchComments: async (productId) => {
    const token = localStorage.getItem("accessToken");
    const res = await AxiosHelper.get(`/products/${productId}/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data; // return array of comments
  },

  postComment: async (productId, content) => {
    const token = localStorage.getItem("accessToken");
    const res = await AxiosHelper.post(
      `/products/${productId}/comments`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data; // return the new comment
  },

  editComment: async (commentId, content) => {
    const token = localStorage.getItem("accessToken");
    const res = await AxiosHelper.put(
      `/comments/${commentId}`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data; // return the updated comment
  },

  deleteComment: async (commentId) => {
    const token = localStorage.getItem("accessToken");
    const res = await AxiosHelper.delete(`/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data; // return status or empty
  }
};

export default CommentAPI;

