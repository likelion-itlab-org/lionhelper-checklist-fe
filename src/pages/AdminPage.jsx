import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/header/Headertest";
import { proPage } from "../apis/api";
import TableComponents from "../components/admin/table/Table";
import GetIssuesComponent from "../components/admin/issues/GetIssuesComponent";
import GetUnCheckedComponent from "../components/admin/unchecked/GetUnChecked";
import useCourseStore from "../store/useCourseStore";
import AdminNavigationTabs from "../components/tab/AdminTab";
import { ContentContainer } from "../components/content_layout/styles";

const AdminPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #fff;
  position: relative;
  padding-top: 1%;
  overflow: auto;
  padding-bottom: 90px;
`;

const AdminPage = () => {
  const { fetchCourseItems } = useCourseStore();
  const [selectedCourse, setSelectedCourse] = useState("전체 과정");

  useEffect(() => {
    fetchCourseItems();
  }, [fetchCourseItems]);

  return (
    <ContentContainer>
      <AdminNavigationTabs />
      <TableComponents
        selectedCourse={selectedCourse}
        onSelectCourse={setSelectedCourse}
      />

      <GetIssuesComponent
        selectedCourse={selectedCourse}
        onSelectCourse={setSelectedCourse}
      />
    </ContentContainer>
  );
};

export default AdminPage;
