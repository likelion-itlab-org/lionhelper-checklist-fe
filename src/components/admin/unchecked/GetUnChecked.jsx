import React, { useEffect, useState } from "react";
import { proPage } from "../../../apis/api";
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
} from "../issues/styles";
import TaskList from "./TaskList";
import useCourseStore from "../../../store/useCourseStore";

const GetUnCheckedComponent = () => {
  const { courseItems } = useCourseStore();

  const [items, setItems] = useState([]); // API 데이터 상태
  const [filteredIssues, setFilteredIssues] = useState([]); // 필터링된 이슈

  const [selectedCourse, setSelectedCourse] = useState("과정 선택");
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
        const response = await proPage.getUnCheckedDescriptions();
        if (response?.data?.data && Array.isArray(response.data.data)) {
          setItems(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedCourse(response.data.data[0].training_course); // 기본 과정 선택
          }
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
    if (!selectedCourse) return;

    const selectedData = items.find(
      (item) => item.training_course === selectedCourse
    );
    setFilteredIssues(selectedData ? selectedData.unchecked_items || [] : []);
  }, [selectedCourse, items]);

  // useEffect(() => {
  //   if (!selectedCourse) return;

  //   // 과정별로 `unchecked_items`를 가져옴
  //   const selectedData = items.find(
  //     (item) => item.training_course === selectedCourse
  //   );

  //   if (selectedData) {
  //     setFilteredIssues(selectedData.unchecked_items || []);
  //   } else {
  //     setFilteredIssues([]);
  //   }
  // }, [selectedCourse, items]);

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
    return <CommentButton onClick={onClick}>제출</CommentButton>;
  };

  const handleSubmitComment = async (index, issueId) => {
    if (!issueId) {
      alert("이슈 ID가 없습니다. 다시 시도해주세요.");
      return;
    }

    const newComment = {
      author: "작성자", // 실제 사용자 정보로 대체 가능
      comment: comments[index],
      created_at: new Date().toISOString(),
    };

    try {
      const response = await proPage.postComments({
        issue_id: issueId,
        comment: comments[index],
      });

      if (response.status === 200 || response.status === 201) {
        alert("댓글이 성공적으로 저장되었습니다.");

        // ✅ UI에서 즉시 반영: issueComments 상태 업데이트
        setIssueComments((prev) => ({
          ...prev,
          [issueId]: prev[issueId]
            ? [...prev[issueId], newComment]
            : [newComment],
        }));

        // ✅ `filteredIssues` 업데이트
        setFilteredIssues((prev) =>
          prev.map((issue) =>
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
      } else {
        alert("댓글 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음"; // 빈 값 방지

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "유효하지 않은 날짜"; // 유효성 검사

    return date.toISOString().split("T")[0]; // "YYYY-MM-DD" 형식 변환
  };

  const handleResolveIssue = async (issueId) => {
    if (!issueId) {
      console.error("🚨 오류: id가 제공되지 않음");
      return;
    }

    try {
      const response = await proPage.deleteUnCheckedDescriptions({
        unchecked_id: issueId,
      });

      if (response.status === 200 || response.status === 201) {
        alert("해결되었습니다.");

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
    setDropdownOpen(false);
  };

  return (
    <Container>
      {/* <TitleWrapper>
        <Title>✍🏻 미체크 항목</Title>
        <DropdownContainer onClick={() => setDropdownOpen(!dropdownOpen)}>
          {selectedCourse || "과정 선택"}
          <DropdownIcon />
          <DropdownList isOpen={dropdownOpen}>
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
      </TitleWrapper> */}
      <TaskList items={items} selectedCourse={selectedCourse} />
      {/* <NoticeBox>
        <NoticeList>
          {filteredIssues.map((item, index) => (
            <NoticeItem key={item.id}>
              {index + 1} {". "}
              {item.content}
              <CommentButton onClick={() => handleResolveIssue(item.id)}>
                해결
              </CommentButton>
              <CommentButton onClick={() => toggleMemo(index)}>
                {memoVisible[index] ? "- 닫기" : "+ 댓글"}
              </CommentButton>
              {memoVisible[index] && (
                <CommentBox>
                  {item.comments &&
                    item.comments.map((comment, i) => (
                      <CommentText key={i}>
                        작성자: {comment.comment} (
                        {formatDate(comment.created_at)})
                      </CommentText>
                    ))}

                  <TextArea
                    placeholder="댓글을 입력하세요"
                    value={comments[index] || ""}
                    onChange={(event) => handleCommentChange(index, event)}
                  />
                  <SubmitButtonComponents
                    onClick={() => handleSubmitComment(index, item.id)}
                  />
                </CommentBox>
              )}
            </NoticeItem>
          ))}
        </NoticeList>
      </NoticeBox> */}
    </Container>
  );
};

export default GetUnCheckedComponent;
