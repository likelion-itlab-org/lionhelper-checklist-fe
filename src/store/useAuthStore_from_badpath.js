import { create } from "zustand";
import { proPage } from "../apis/api";

const useAuthStore = create((set) => ({
  username: sessionStorage.getItem("username") || null, // 세션에서 username 불러오기

  setUsername: (name) => {
    sessionStorage.setItem("username", name); // 세션에 username 저장
    set({ username: name });
  },

  postLogin: async (loginData) => {
    try {
      const response = await proPage.postLogin(loginData);
      if (response.data.success) {
        // const userName = response.data.user.username;
        // sessionStorage.setItem("username", userName); // 세션에 username 저장
        // set({ username: userName });
        alert("로그인 완료!");
        return response.data;
      } else {
        alert("아이디와 비밀번호를 확인해주세요!");
      }
    } catch (error) {
      console.error("로그인 오류:", error.response || error);
      // alert("아이디와 비밀번호를 확인해주세요!");
    }
  },

  logout: () => {
    sessionStorage.removeItem("username"); // 로그아웃 시 세션에서 삭제
    set({ username: null });
  },
}));

export default useAuthStore;
