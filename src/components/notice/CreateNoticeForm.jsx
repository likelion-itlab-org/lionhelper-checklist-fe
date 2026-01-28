import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import useAuthStore from "../../store/useAuthStore";
import { proPage } from "../../apis/api";

const Container = styled.div`
  width: calc(100% - 270px);
  max-width: 800px;
  height: calc(100vh - 100px);
  margin: 0 auto;
  padding: 30px 20px;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-left: 135px;

  @media screen and (max-width: 768px) {
    width: 100%;
    left: 0;
    transform: none;
    margin-left: 0;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 50px;
  gap: 20px;
`;

const Select = styled.select`
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  background: white;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-width: 200px;

  &:focus {
    outline: none;
    /* border-color: #ff7710; */
    /* box-shadow: 0 0 0 3px rgba(255, 119, 16, 0.1); */
  }
`;

const TitleInput = styled.input`
  width: 95%;
  padding: 15px;
  font-size: 24px;
  margin-top: 30px;
  border: none;
  border-bottom: 2px solid #ffefe0;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-bottom-color: #ff7710;
  }

  &::placeholder {
    color: #999;
  }
`;

const ContentInput = styled.textarea`
  width: 95%;
  height: 500px;
  margin-top: 20px;
  padding: 15px;
  font-size: 16px;
  border: 2px solid #ffefe0;
  border-radius: 12px;
  resize: none;
  transition: all 0.2s ease-in-out;
  line-height: 1.6;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  background: #ffefe0;
  color: #ff7710;
  font-weight: 600;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(255, 119, 16, 0.1);

  &:hover {
    background: #ff7710;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 119, 16, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled(GoChevronLeft)`
  cursor: pointer;
  color: #555;
  transition: all 0.2s ease-in-out;
  padding: 8px;
  border-radius: 50%;
  background: #ffefe0;

  &:hover {
    color: #ff7710;
    background: #fff5eb;
  }
`;

const CreateNoticeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = location.state?.isEdit;
  const noticeData = location.state?.noticeData;
  const { username, logout } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("카테고리 선택");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && noticeData) {
      setTitle(noticeData.title);
      setContent(noticeData.content);
      setCategory(noticeData.category);
    }
  }, [isEdit, noticeData]);

  const handleSubmit = async () => {
    if (category === "카테고리 선택") {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const noticeData = {
        title: title,
        content: content,
        username: username,
        type: category,
      };

      const response = await proPage.postNotice(noticeData);

      if (response.status === 200 || response.status === 201) {
        alert(
          isEdit ? "공지사항이 수정되었습니다." : "공지사항이 등록되었습니다."
        );
        navigate(-1); // 이전 페이지로 이동
      } else {
        alert("공지사항 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("공지사항 등록 오류:", error);
      alert("공지사항 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <BackButton size={40} onClick={() => navigate(-1)} />

      <FlexContainer>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="카테고리 선택">카테고리 선택</option>
          <option value="출결">출결</option>
          <option value="공결">공결</option>
          <option value="훈련장려금">훈련장려금</option>
          {/* <option value="규정">규정</option>
          <option value="긴급">긴급</option> */}
        </Select>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : isEdit ? "수정하기" : "등록하기"}
        </Button>
      </FlexContainer>

      <TitleInput
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ContentInput
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </Container>
  );
};

export default CreateNoticeForm;
