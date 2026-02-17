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
  ClickableRow,
  ExpandedArea,
  EmptyText,
  IssuesList,
  IssueItem,
  IssueHeaderRow,
  DateBadge,
  IssueContent,
  CommentToggleRow,
  CommentToggleButton,
  Chevron,
  CommentsBox,
  CommentsLoadingText,
  CommentsEmptyText,
  CommentsList,
  CommentItem,
  CommentMetaRow,
  CommentAuthor,
  CommentDate,
  CommentBody,
  CommentFormRow,
  CommentInput,
  CommentSubmitButton,
  HintText,
} from "./styles";
import { proPage } from "../../../apis/api";
import {
  DropdownContainer,
  DropdownIcon,
  DropdownItem,
  DropdownList,
  TitleWrapper,
} from "../issues/styles";
import useAuthStore from "../../../store/useAuthStore";

const TableComponents = ({ onSelectCourse }) => {
  const { username } = useAuthStore();

  const [allCheckRate, setAllCheckRate] = useState([]);
  const [selectedDept, setSelectedDept] = useState("전체 보기");
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  const [openCourses, setOpenCourses] = useState(() => new Set());
  const [issuesItems, setIssuesItems] = useState([]);

  const [openComments, setOpenComments] = useState(() => new Set());
  const [issueCommentsMap, setIssueCommentsMap] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  const [commentInputs, setCommentInputs] = useState({});
  const [submitting, setSubmitting] = useState({});

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
        setOpenComments(new Set());
      }
      return next;
    });
  };

  const formatMMDD = (createdAt) => {
    if (!createdAt) return "";
    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const fetchIssueComments = async (issueId) => {
    try {
      setLoadingComments((prev) => ({ ...prev, [issueId]: true }));
      const res = await proPage.getComments({ params: { issue_id: issueId } });
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setIssueCommentsMap((prev) => ({ ...prev, [issueId]: list }));
    } catch (e) {
      console.error(e);
      setIssueCommentsMap((prev) => ({ ...prev, [issueId]: [] }));
    } finally {
      setLoadingComments((prev) => ({ ...prev, [issueId]: false }));
    }
  };

  const toggleIssueComments = async (e, issueId) => {
    e.stopPropagation();

    setOpenComments((prev) => {
      const next = new Set(prev);
      if (next.has(issueId)) next.delete(issueId);
      else next.add(issueId);
      return next;
    });

    if (!issueCommentsMap[issueId]) {
      await fetchIssueComments(issueId);
    }
  };

  const onChangeCommentInput = (issueId, value) => {
    setCommentInputs((prev) => ({ ...prev, [issueId]: value }));
  };

  const handleSubmitComment = async (e, issueId) => {
    e.stopPropagation();

    const text = (commentInputs[issueId] || "").trim();
    if (!text) return;

    try {
      setSubmitting((prev) => ({ ...prev, [issueId]: true }));

      const res = await proPage.postComments({
        issue_id: issueId,
        comment: text,
        username: username,
      });

      if (!(res.status === 200 || res.status === 201)) {
        alert("댓글 저장에 실패했습니다.");
        return;
      }

      const newComment = {
        created_by: username,
        comment: text,
        created_at: new Date().toISOString(),
      };

      setIssueCommentsMap((prev) => ({
        ...prev,
        [issueId]: [...(prev[issueId] || []), newComment],
      }));

      setCommentInputs((prev) => ({ ...prev, [issueId]: "" }));

      await fetchIssueComments(issueId);
    } catch (err) {
      console.error(err);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting((prev) => ({ ...prev, [issueId]: false }));
    }
  };

  return (
    <Container>
      <TitleWrapper>
        <DropdownContainer onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}>
          {selectedDept}
          <DropdownIcon />
          <DropdownList isOpen={deptDropdownOpen}>
            {uniqueDepts.map((dept) => (
              <DropdownItem
                key={dept}
                onClick={(e) => {
                  e.stopPropagation();
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
                  <ClickableRow $active={isOpen} onClick={() => toggleCourse(course)}>
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
                  </ClickableRow>

                  {isOpen && (
                    <tr>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <ExpandedArea>
                          {issues.length === 0 ? (
                            <EmptyText>이슈가 없습니다.</EmptyText>
                          ) : (
                            <IssuesList>
                              {issues.slice(0, 5).map((issue) => {
                                const issueId = issue.id;
                                const isCommentsOpen = openComments.has(issueId);
                                const comments = issueCommentsMap[issueId] || [];
                                const isLoading = !!loadingComments[issueId];

                                const commentCount =
                                  typeof issue.comments?.length === "number"
                                    ? issue.comments.length
                                    : issueCommentsMap[issueId]?.length ?? 0;

                                return (
                                  <IssueItem key={issueId}>
                                    <IssueHeaderRow>
                                      <DateBadge>{formatMMDD(issue.created_at)}</DateBadge>
                                      {issue.created_by}
                                    </IssueHeaderRow>

                                    <IssueContent>{issue.content}</IssueContent>

                                    <CommentToggleRow>
                                      <CommentToggleButton
                                        type="button"
                                        onClick={(e) => toggleIssueComments(e, issueId)}
                                      >
                                        <Chevron>{isCommentsOpen ? "▾" : "▸"}</Chevron>
                                        <span>댓글 {commentCount}개</span>
                                      </CommentToggleButton>
                                    </CommentToggleRow>

                                    {isCommentsOpen && (
                                      <CommentsBox onClick={(e) => e.stopPropagation()}>
                                        {isLoading ? (
                                          <CommentsLoadingText>댓글 불러오는 중...</CommentsLoadingText>
                                        ) : comments.length === 0 ? (
                                          <CommentsEmptyText>댓글이 없습니다.</CommentsEmptyText>
                                        ) : (
                                          <CommentsList>
                                            {comments.map((c, i) => {
                                              const author = c.created_by ?? c.author ?? "익명";
                                              const dateText = c.created_at
                                                ? formatMMDD(c.created_at)
                                                : "";

                                              return (
                                                <CommentItem key={`${issueId}-c-${i}`}>
                                                  <CommentMetaRow>
                                                    <CommentAuthor title={author}>{author}</CommentAuthor>
                                                    {!!dateText && <CommentDate>{dateText}</CommentDate>}
                                                  </CommentMetaRow>
                                                  <CommentBody>{c.comment}</CommentBody>
                                                </CommentItem>
                                              );
                                            })}
                                          </CommentsList>
                                        )}

                                        <CommentFormRow>
                                          <CommentInput
                                            value={commentInputs[issueId] || ""}
                                            onChange={(e) =>
                                              onChangeCommentInput(issueId, e.target.value)
                                            }
                                            placeholder="댓글을 입력하세요"
                                            onKeyDown={(e) => {
                                              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                                                handleSubmitComment(e, issueId);
                                              }
                                            }}
                                          />
                                          <CommentSubmitButton
                                            type="button"
                                            disabled={!!submitting[issueId]}
                                            onClick={(e) => handleSubmitComment(e, issueId)}
                                          >
                                            {submitting[issueId] ? "작성 중..." : "댓글 작성"}
                                          </CommentSubmitButton>
                                        </CommentFormRow>

                                        <HintText>⌘/Ctrl + Enter 로 빠르게 등록 가능</HintText>
                                      </CommentsBox>
                                    )}
                                  </IssueItem>
                                );
                              })}
                            </IssuesList>
                          )}
                        </ExpandedArea>
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
