import AxiosHelper from "./axios_helper.js";

const UserAPI = {
  getUserData: async (userId = null) => {
    let url = "/users/";
    if (userId) {
      url += userId;
    } else {
      url += "me";
    }

    const token = localStorage.getItem("accessToken");
    const res = await AxiosHelper.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

  editUserData: async (userData = null) => {
    const token = localStorage.getItem("accessToken");
    const res = await AxiosHelper.put("/users/edit", userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },
  deleteUser: async () => {
    const token = localStorage.getItem("accessToken");
    const res = await AxiosHelper.post("/users/delete", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  }

};

export default UserAPI;