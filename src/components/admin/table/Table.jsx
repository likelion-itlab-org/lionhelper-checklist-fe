import React, { useEffect, useMemo, useState } from "react";
import {
  TableWrapper,
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

const TableComponents = ({ selectedCourse }) => {
  const [allCheckRate, setAllCheckRate] = useState([]);
  const [selectedDept, setSelectedDept] = useState("전체 보기");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ 여러 과정 동시 토글
  const [openCourses, setOpenCourses] = useState(() => new Set());

  // ✅ 테이블 토글 영역에 보여줄 이슈 데이터(미리보기)
  const [issuesItems, setIssuesItems] = useState([]);

  useEffect(() => {
    const fetchAllCheckRate = async () => {
      try {
        const response = await proPage.getAllCheckRate();
        if (response?.data?.data) setAllCheckRate(response.data.data);
      } catch (error) {
        console.error("Error fetching checklist:", error);
      }
    };
    fetchAllCheckRate();
  }, []);

  useEffect(() => {
    const fetchIssuesList = async () => {
      try {
        const res = await proPage.getIssues();
        if (res?.data?.data && Array.isArray(res.data.data)) {
          setIssuesItems(res.data.data);
        } else {
          setIssuesItems([]);
        }
      } catch (e) {
        console.error("Error fetching issues:", e);
        setIssuesItems([]);
      }
    };
    fetchIssuesList();
  }, []);

  const uniqueDepts = useMemo(
    () => ["전체 보기", ...new Set(allCheckRate.map((item) => item.dept))],
    [allCheckRate]
  );

  const filteredCheckRate = useMemo(() => {
    return selectedDept !== "전체 보기"
      ? allCheckRate.filter((item) => item.dept === selectedDept)
      : allCheckRate;
  }, [allCheckRate, selectedDept]);

  // ✅ training_course -> issues[] 맵
  const issuesByCourse = useMemo(() => {
    const map = new Map();
    issuesItems.forEach((courseItem) => {
      map.set(courseItem.training_course, courseItem.issues || []);
    });
    return map;
  }, [issuesItems]);

  const toggleCourse = (course) => {
    setOpenCourses((prev) => {
      const next = new Set(prev);
      if (next.has(course)) next.delete(course);
      else next.add(course);
      return next;
    });
  };

  // (선택) 이슈 content를 짧게 미리보기로 보여주고 싶을 때
  const previewText = (text, max = 140) => {
    const t = String(text ?? "").replace(/\s+/g, " ").trim();
    return t.length > max ? `${t.slice(0, max)}…` : t;
  };

  return (
    <Container>
      <TitleWrapper>
        <DropdownContainer onClick={() => setDropdownOpen(!dropdownOpen)}>
          {selectedDept}
          <DropdownIcon />
          <DropdownList isOpen={dropdownOpen}>
            {uniqueDepts.map((dept) => (
              <DropdownItem
                key={dept}
                onClick={() => {
                  setSelectedDept(dept);
                  setDropdownOpen(false);
                }}
              >
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
            {filteredCheckRate.map((item) => {
              const course = item.training_course;
              const isOpen = openCourses.has(course);
              const isSelected = selectedCourse === course;

              const courseIssues = issuesByCourse.get(course) || [];

              return (
                <React.Fragment key={course}>
                  <TableRow
                    // ✅ 강조: 열려있거나(토글), 하단 드롭다운에서 선택된 과정이면 강조 유지
                    // 원치 않으면 $active={isOpen} 로 바꾸면 됨
                    $active={isOpen || isSelected}
                    onClick={() => toggleCourse(course)} // ✅ 하단 선택과 분리!
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{course}</TableCell>
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

                  {/* ✅ 토글 펼침 영역 */}
                  {isOpen && (
                    <tr>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div
                          style={{
                            padding: "16px 20px",
                            background: "#fff7ed",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: 10 }}>
                            {course} 이슈 ({courseIssues.length})
                          </div>

                          {courseIssues.length === 0 ? (
                            <div style={{ color: "#666" }}>이슈가 없습니다.</div>
                          ) : (
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                              {courseIssues.slice(0, 5).map((issue) => (
                                <li key={issue.id} style={{ marginBottom: 10 }}>
                                  <div style={{ fontWeight: 600 }}>
                                    {issue.created_by}
                                  </div>
                                  <div style={{ whiteSpace: "pre-wrap" }}>
                                    {previewText(issue.content)}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}

                          {courseIssues.length > 5 && (
                            <div
                              style={{
                                marginTop: 8,
                                color: "#666",
                                fontSize: 13,
                              }}
                            >
                              ※ 전체 이슈/댓글/해결 처리는 아래 “이슈사항” 영역에서
                              진행하세요.
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default TableComponents;
