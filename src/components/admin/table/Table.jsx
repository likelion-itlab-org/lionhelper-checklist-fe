import React, { useEffect, useState } from "react";
import {
  TableWrapper,
  Title,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
  TableUrgencyCell,
  UrgencyBadge,
} from "./styles";
import { proPage } from "../../../apis/api";
import {
  DropdownContainer,
  DropdownIcon,
  DropdownItem,
  DropdownList,
  TitleWrapper,
} from "../issues/styles";
import useCourseStore from "../../../store/useCourseStore";
import GetIssuesComponent from "../issues/GetIssuesComponent";
import useAuthStore from "../../../store/useAuthStore";


const TableComponents = ({
  selectedCourse,
  onSelectCourse,
}) => {
  const [taskData, setTaskData] = useState([]);
  const [selectedDept, setSelectedDept] = useState("전체 보기");
  const { username, logout } = useAuthStore(); 
  const [allCheckRate, setAllCheckRate] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAllCheckRate = async () => {
      try {
        const response = await proPage.getAllCheckRate();
        if (response && response.data) {
          setAllCheckRate(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching checklist:", error);
      }
    };

    fetchAllCheckRate();
  }, []);

  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    setDropdownOpen(false);
  };

  const uniqueDepts = [
    "전체 보기",
    ...new Set(allCheckRate.map((item) => item.dept)),
  ];

  const filteredCheckRate =
    selectedDept !== "전체 보기"
      ? allCheckRate.filter((item) => item.dept === selectedDept)
      : allCheckRate;

  return (
    <Container>
      <TitleWrapper>
        <DropdownContainer onClick={() => setDropdownOpen(!dropdownOpen)}>
          {selectedDept}
          <DropdownIcon />
          <DropdownList isOpen={dropdownOpen}>
            {uniqueDepts.map((dept) => (
              <DropdownItem key={dept} onClick={() => handleDeptSelect(dept)}>
                {dept}
              </DropdownItem>
            ))}
          </DropdownList>
        </DropdownContainer>
      </TitleWrapper>

      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>과정</TableHeader>
              <TableHeader>담당자</TableHeader>
              <TableHeader>오늘 체크율</TableHeader>
              <TableHeader>오늘의 완수여부</TableHeader>
              <TableHeader>전일 체크율</TableHeader>
              <TableHeader>월별 누적 체크율</TableHeader>
            </TableRow>
          </TableHead>

          <tbody>
            {filteredCheckRate.map((item, index) => {
              const isActive = selectedCourse === item.training_course;

              return (
                <TableRow
                  key={index}
                  $active={isActive}
                  onClick={() => {
                    onSelectCourse?.(item.training_course);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{item.training_course}</TableCell>
                  <TableCell>{item.manager_name}</TableCell>
                  <TableCell>{item.daily_check_rate}</TableCell>

                  <TableUrgencyCell>
                    <UrgencyBadge urgent={item.daily_check_rate === "100.0%"}>
                      {item.daily_check_rate === "100.0%" ? "완수" : "미완수"}
                    </UrgencyBadge>
                  </TableUrgencyCell>

                  <TableCell>{item.yesterday_check_rate}</TableCell>
                  <TableCell>{item.overall_check_rate}</TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default TableComponents;
