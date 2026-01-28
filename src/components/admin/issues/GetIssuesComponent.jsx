import React, { useEffect, useState } from "react";
import { proPage } from "../../../apis/api";
import useCourseStore from "../../../store/useCourseStore";
import {
  Container,
  Title,
  NoticeBox,
  TextArea,
  CommentBox,
  NoticeItem,
  MemoInput,
  MemoBox,
  SubmitButton,
  CommentButton,
  NoticeList,
  CommentText,
  DropdownContainer,
  DropdownIcon,
  DropdownList,
  DropdownItem,
  TitleWrapper,
  TextAreaContainer,
  ButtonWrapper,
  NoticeContent,
  NoticeText,
  ContentWrapper,
  ContentLine,
} from "./styles";
import useAuthStore from "../../../store/useAuthStore";

const GetIssuesComponent = () => {
  const { courseItems } = useCourseStore();
  const { username, logout } = useAuthStore();

  const [items, setItems] = useState([]); // API 데이터 상태
  const [filteredIssues, setFilteredIssues] = useState([]); // 필터링된 이슈

  const [selectedCourse, setSelectedCourse] = useState("전체 과정");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [comments, setComments] = useState(Array(items.length).fill(""));
  const [issueComments, setIssueComments] = useState({});
  // const [issues, setIssues] = useState([]); // issues 상태 추가
  const [memoVisible, setMemoVisible] = useState(
    Array(items.length).fill(false)
  ); // uncheckedItems로

  useEffect(() => {
    const fetchIssuesList = async () => {
      try {
        const response = await proPage.getIssues();
        if (response?.data?.data && Array.isArray(response.data.data)) {
          setItems(response.data.data);

          // ✅ "전체 과정" 선택 시 모든 이슈를 가져오면서 training_course 정보도 포함
          const allIssues = response.data.data.flatMap((item) =>
            (item.issues || []).map((issue) => ({
              ...issue,
              training_course: item.training_course, // training_course 정보 추가
            }))
          );
          setFilteredIssues(allIssues);
        } else {
          console.error("데이터 형식 오류: 예상된 데이터가 없습니다.");
        }
      } catch (error) {
        console.error("API 호출 오류:", error);
      }
    };
    fetchIssuesList();
  }, []);

  useEffect(() => {
    if (selectedCourse === "전체 과정") {
      // ✅ 모든 이슈에 training_course 정보 추가
      const allIssues = items.flatMap((item) =>
        (item.issues || []).map((issue) => ({
          ...issue,
          training_course: item.training_course, // training_course 정보 포함
        }))
      );
      setFilteredIssues(allIssues);
    } else {
      const selectedIssues = items
        .filter((item) => item.training_course === selectedCourse)
        .flatMap((item) =>
          (item.issues || []).map((issue) => ({
            ...issue,
            training_course: item.training_course, // training_course 정보 포함
          }))
        );
      setFilteredIssues(selectedIssues);
    }
  }, [selectedCourse, items]); // ✅ `items` 변경 시 자동 반영

  useEffect(() => {
    items.forEach((element, index) => {
      if (memoVisible[index] && !issueComments[element.id]) {
        fetchComments(element.id);
      }
    });
  }, [memoVisible, items]);

  const toggleMemo = (index) => {
    setMemoVisible((prev) => {
      const newMemoVisible = [...prev];
      newMemoVisible[index] = !newMemoVisible[index];
      return newMemoVisible;
    });
  };

  const fetchComments = async (issueId) => {
    try {
      if (!issueId) {
        console.error("🚨 오류: issue_id가 제공되지 않음");
        return;
      }

      const response = await proPage.getComments({
        params: { issue_id: issueId },
      }); // 🔹 query로 issue_id 전달
      if (response.status === 200) {
        setIssueComments((prev) => ({
          ...prev,
          [issueId]: response.data.data, // 🔹 API 응답 구조 맞게 수정
        }));
      } else {
        console.error("🚨 댓글 조회 실패:", response.data.message);
      }
    } catch (error) {
      console.error("🚨 API 호출 오류:", error);
    }
  };

  // 댓글 입력값 변경 핸들러
  const handleCommentChange = (index, event) => {
    const newComments = [...comments];
    newComments[index] = event.target.value; // event.target이 정상적으로 접근됨
    setComments(newComments);
  };

  const SubmitButtonComponents = ({ onClick }) => {
    return <SubmitButton onClick={onClick}>제출</SubmitButton>;
  };

  const handleSubmitComment = async (index, issueId) => {
    if (!issueId) {
      alert("이슈 ID가 없습니다. 다시 시도해주세요.");
      return;
    }

    const newComment = {
      author: username, // 실제 사용자 이름으로 변경
      comment: comments[index],
      created_at: new Date().toISOString(),
      created_by: username, // 작성자명 추가
    };

    try {
      const response = await proPage.postComments({
        issue_id: issueId,
        comment: comments[index],
        username: username,
      });

      if (response.status === 200 || response.status === 201) {
        alert("댓글이 성공적으로 저장되었습니다.");

        // ✅ `items` 상태 업데이트 (새 댓글 반영)
        setItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            issues: item.issues.map((issue) =>
              issue.id === issueId
                ? {
                    ...issue,
                    comments: [...(issue.comments || []), newComment],
                  }
                : issue
            ),
          }))
        );

        // ✅ `filteredIssues`도 즉시 반영
        setFilteredIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue.id === issueId
              ? { ...issue, comments: [...(issue.comments || []), newComment] }
              : issue
          )
        );

        // ✅ 입력 필드 초기화
        setComments((prev) => {
          const newComments = [...prev];
          newComments[index] = "";
          return newComments;
        });

        // ✅ 댓글 목록 새로고침
        fetchComments(issueId);
      } else {
        alert("댓글 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  // 날짜를 "3월 18일" 형식으로 변환하는 함수
  const formatDate = (date) => {
    return new Date(date)
      .toLocaleDateString("ko-KR", { month: "long", day: "numeric" })
      .replace("월", "월 ")
      .replace("일", "일");
  };

  const handleResolveIssue = async (issueId) => {
    if (!issueId) {
      console.error("🚨 오류: issue_id가 제공되지 않음");
      return;
    }

    try {
      const response = await proPage.deleteIssues({ issue_id: issueId });

      if (response.status === 200 || response.status === 201) {
        alert("이슈가 해결되었습니다.");

        // ✅ `items` 업데이트
        setItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            issues: item.issues.filter((issue) => issue.id !== issueId),
          }))
        );

        // ✅ `filteredIssues`도 즉시 반영
        setFilteredIssues((prevIssues) =>
          prevIssues.filter((issue) => issue.id !== issueId)
        );

        // ✅ 해당 이슈의 댓글 데이터 삭제
        setIssueComments((prev) => {
          const updatedComments = { ...prev };
          delete updatedComments[issueId];
          return updatedComments;
        });
      } else {
        alert("이슈 해결에 실패했습니다.");
      }
    } catch (error) {
      console.error("이슈 해결 API 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setDropdownOpen(false); // 드롭다운 닫기
  };

  return (
    <Container>
      <TitleWrapper>
        <Title>이슈사항</Title>
        <DropdownContainer onClick={() => setDropdownOpen(!dropdownOpen)}>
          {selectedCourse || "과정 선택"}
          <DropdownIcon />
          <DropdownList isOpen={dropdownOpen}>
            <DropdownItem
              key="all-courses"
              onClick={() => handleCourseSelect("전체 과정")}
            >
              전체 과정
            </DropdownItem>
            {courseItems.map((course) => (
              <DropdownItem
                key={course}
                onClick={() => handleCourseSelect(course)}
              >
                {course}
              </DropdownItem>
            ))}
          </DropdownList>
        </DropdownContainer>
      </TitleWrapper>
      <NoticeBox>
        <NoticeList>
          {filteredIssues.length > 0 ? (
            filteredIssues.map((item, index) => (
              <NoticeItem key={`${item.id}-${index}`}>
                <NoticeContent>
                  <NoticeText>
                    {selectedCourse === "전체 과정" && (
                      <strong>
                        {item.training_course} ({item.created_by})
                      </strong>
                    )}
                    <ContentWrapper>
                      {item.content
                        .replace(/-/g, "\n-")
                        .split("\n")
                        .map((line, index) => {
                          const trimmedLine = line.trim();
                          const isBullet = trimmedLine.startsWith("-");
                          const content = isBullet
                            ? trimmedLine.substring(1).trim()
                            : trimmedLine;

                          return (
                            <ContentLine key={index} isBullet={isBullet}>
                              {content}
                            </ContentLine>
                          );
                        })}
                    </ContentWrapper>
                    <span
                      style={{
                        color: "#FF7710",
                        fontSize: "13px",
                        marginTop: "8px",
                      }}
                    >
                      {formatDate(item.date)}
                    </span>
                  </NoticeText>
                  <ButtonWrapper>
                    <CommentButton onClick={() => handleResolveIssue(item.id)}>
                      해결
                    </CommentButton>
                    <CommentButton onClick={() => toggleMemo(index, item.id)}>
                      {memoVisible[index]
                        ? "댓글 닫기"
                        : `댓글 ${
                            item.comments?.length
                              ? `(${item.comments.length})`
                              : ""
                          }`}
                    </CommentButton>
                  </ButtonWrapper>
                </NoticeContent>

                {memoVisible[index] && (
                  <CommentBox>
                    {item.comments &&
                      item.comments.map((comment, i) => (
                        <CommentText key={i}>
                          {comment.created_by}
                          {" : "}
                          {comment.comment}
                          <span
                            style={{
                              color: "#999",
                              fontSize: "12px",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {formatDate(comment.created_at)}
                          </span>
                        </CommentText>
                      ))}
                    <TextAreaContainer>
                      <TextArea
                        placeholder="댓글을 입력하세요"
                        value={comments[index] || ""}
                        onChange={(event) => handleCommentChange(index, event)}
                      />
                      <SubmitButton
                        onClick={() => handleSubmitComment(index, item.id)}
                      >
                        댓글 작성
                      </SubmitButton>
                    </TextAreaContainer>
                  </CommentBox>
                )}
              </NoticeItem>
            ))
          ) : (
            <NoticeItem style={{ textAlign: "center", color: "#666" }}>
              이슈 사항이 없습니다.
            </NoticeItem>
          )}
        </NoticeList>
      </NoticeBox>
    </Container>
  );
};

export default GetIssuesComponent;
