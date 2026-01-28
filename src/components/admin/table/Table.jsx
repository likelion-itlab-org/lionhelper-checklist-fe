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

const TableComponents = () => {
  // const { courseItems } = useCourseStore();

  const [taskData, setTaskData] = useState([]);
  const [selectedDept, setSelectedDept] = useState("전체 보기");
  const { username, logout } = useAuthStore(); // username 상태 가져오기
  const [allCheckRate, setAllCheckRate] = useState([]);
  // const [taskData, setTaskData] = useState([
  //   {
  //     dept: "TechSolLab",
  //     training_course: "데이터분석 부트캠프 4회차",
  //     manager: "최갑주",
  //     today_check_rate: "80.0%",
  //     check_rate: "80.0%",
  //   },
  //   {
  //     dept: "TechSolLab",
  //     training_course: "클라우드 엔지니어링 2회차",
  //     manager: "박세은",
  //     today_check_rate: "80.0%",
  //     check_rate: "80.0%",
  //   },
  //   {
  //     dept: "TechSolLab",
  //     training_course: "그로스마케팅 1회차",
  //     manager: "이채안",
  //     today_check_rate: "90.0%",
  //     check_rate: "80.0%",
  //   },
  //   {
  //     dept: "DevLab",
  //     training_course: "Android 부트캠프 3회차",
  //     manager: "이도현",
  //     today_check_rate: "100.0%",
  //     check_rate: "100.0%",
  //   },
  //   {
  //     dept: "PilotTeam",
  //     training_course: "유니티 게임 부트캠프 3회차",
  //     manager: "전승목",
  //     today_check_rate: "70.0%",
  //     check_rate: "80.0%",
  //   },
  // ]);
  const [selectedCourse, setSelectedCourse] = useState("과정 선택");
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
        {/* <Title>✍🏻 업무 현황</Title> */}
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
              return (
                <TableRow key={index}>
                  <TableCell>{item.training_course}</TableCell>
                  <TableCell>{item.manager_name}</TableCell>
                  {/* `matchingCheckRate`가 있으면 해당 `check_rate`를 보여주고, 없으면 기본값 표시 */}
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
