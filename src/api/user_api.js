import AxiosHelper from "./axios_helper.js";

const UserAPI = {
  getUserData: async (userId = null) => {
    let url = "/users/";
    
    if (userId) {
      url += userId;
    } else {
      url += "me";
    }

    const res = await AxiosHelper.get(url); 
    return res.data;
  },

  editUserData: async () => {
    const res = await AxiosHelper.post("/users/user/edit", userData);
    return res.status;
  }

};

export default UserAPI;