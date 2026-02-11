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

const TableComponents = ({ onSelectCourse }) => {
  const [allCheckRate, setAllCheckRate] = useState([]);
  const [selectedDept, setSelectedDept] = useState("전체 보기");
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  const [openCourses, setOpenCourses] = useState(() => new Set());
  const [issuesItems, setIssuesItems] = useState([]);

  useEffect(() => {
    const fetchAllCheckRate = async () => {
      try {
        const res = await proPage.getAllCheckRate();
        if (res?.data?.data) setAllCheckRate(res.data.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllCheckRate();
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await proPage.getIssues();
        if (res?.data?.data && Array.isArray(res.data.data)) {
          setIssuesItems(res.data.data);
        } else {
          setIssuesItems([]);
        }
      } catch (e) {
        console.error(e);
        setIssuesItems([]);
      }
    };
    fetchIssues();
  }, []);


  const uniqueDepts = useMemo(
    () => ["전체 보기", ...new Set(allCheckRate.map((v) => v.dept))],
    [allCheckRate]
  );

  const filteredCheckRate = useMemo(() => {
    return selectedDept === "전체 보기"
      ? allCheckRate
      : allCheckRate.filter((v) => v.dept === selectedDept);
  }, [allCheckRate, selectedDept]);

  const issuesByCourse = useMemo(() => {
    const map = new Map();
    issuesItems.forEach((v) => map.set(v.training_course, v.issues || []));
    return map;
  }, [issuesItems]);


  const toggleCourse = (course) => {
    setOpenCourses((prev) => {
      const next = new Set(prev);
      const willOpen = !next.has(course);

      if (willOpen) {
        next.add(course);
        onSelectCourse?.(course); 
      } else {
        next.delete(course);
      }

      return next;
    });
  };

  const formatDate = (createdAt) => {
    if (!createdAt) return "";
    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return "";

    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${mm}/${dd}`;
  };

  const DateBadge = ({ text }) => {
    if (!text) return null;
    return (
      <span
        style={{
          marginRight: 8,
          padding: "2px 10px",
          borderRadius: 9999,
          background: "#FF7710",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <Container>
      <TitleWrapper>
        <DropdownContainer
          onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
        >
          {selectedDept}
          <DropdownIcon />
          <DropdownList isOpen={deptDropdownOpen}>
            {uniqueDepts.map((dept) => (
              <DropdownItem
                key={dept}
                onClick={() => {
                  setSelectedDept(dept);
                  setDeptDropdownOpen(false);
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
              const issues = issuesByCourse.get(course) || [];

              return (
                <React.Fragment key={course}>
                  <TableRow
                    $active={isOpen}
                    onClick={() => toggleCourse(course)}
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

                  {isOpen && (
                    <tr>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div
                          style={{
                            padding: 24,
                            background: "#fff7ed",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >

                          {issues.length === 0 ? (
                            <div style={{ color: "#666" }}>이슈가 없습니다.</div>
                          ) : (
                            <ul
                              style={{
                                listStyle: "none",
                                paddingLeft: 0,
                                margin: 0,
                              }}
                            >
                              {issues.slice(0, 5).map((issue, idx) => (
                                <li
                                  key={issue.id}
                                  style={{
                                    paddingTop: idx === 0 ? 0 : 12,
                                    marginTop: idx === 0 ? 0 : 12,
                                    borderTop:
                                      idx === 0 ? "none" : "1px solid #E5E7EB",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontWeight: 600,
                                      marginBottom: 4,
                                    }}
                                  >
                                    <DateBadge text={formatDate(issue.created_at)} />
                                    {issue.created_by}
                                  </div>

                                  <div
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {issue.content}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}

                          {issues.length > 5 && (
                            <div
                              style={{
                                marginTop: 10,
                                color: "#666",
                                fontSize: 13,
                              }}
                            >
                              ※ 나머지 이슈/댓글/해결 처리는 아래 “이슈사항”에서
                              확인하세요.
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
