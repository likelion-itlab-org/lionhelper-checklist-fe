// AdminPage.jsx (전체 코드)
// ✅ 테이블 토글 클릭 시 하단 이슈 목록(selectedCourse)도 해당 과정으로 변경
// ✅ 하단 드롭다운은 기존대로 유지
import React, { useEffect, useState } from "react";
import AdminNavigationTabs from "../components/tab/AdminTab";
import { ContentContainer } from "../components/content_layout/styles";
import useCourseStore from "../store/useCourseStore";
import TableComponents from "../components/admin/table/Table";
import GetIssuesComponent from "../components/admin/issues/GetIssuesComponent";

const AdminPage = () => {
  const { fetchCourseItems } = useCourseStore();
  const [selectedCourse, setSelectedCourse] = useState("전체 과정");

  useEffect(() => {
    fetchCourseItems();
  }, [fetchCourseItems]);

  return (
    <ContentContainer>
      <AdminNavigationTabs />

      <TableComponents onSelectCourse={setSelectedCourse} />

      <GetIssuesComponent
        selectedCourse={selectedCourse}
        onSelectCourse={setSelectedCourse}
      />
    </ContentContainer>
  );
};

export default AdminPage;
