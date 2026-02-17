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
