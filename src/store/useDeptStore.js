import { create } from "zustand";
import { proPage } from "../apis/api";

const useCourseStore = create((set) => ({
  courseItems: [], // 과정 데이터 저장
  selectedCourse: "과정 선택", // 선택된 과정 (초기값)

  setSelectedCourse: (course) => set({ selectedCourse: course }),

  fetchCourseItems: async () => {
    try {
      const response = await proPage.getCourse();
      if (response?.data?.data) {
        set({ courseItems: response.data.data });
      } else {
        console.error("🚨 데이터 형식 오류: 예상된 데이터가 없습니다.");
      }
    } catch (error) {
      console.error("🚨 API 호출 오류:", error);
    }
  },
}));

export default useCourseStore;
