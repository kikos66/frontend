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

  editUserData: async(userData = null) => {
    const res = await AxiosHelper.put("/users/edit", userData);
    return res.data;
  },

  deleteUser: async() => {
    const res = await AxiosHelper.post("/users/delete");
    return res.data;
  }

};

export default UserAPI;