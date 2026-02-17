// NoticeBoard.jsx
import React, { useState, useEffect } from "react";
import { SearchBox, SearchInput, SearchIcon } from "../notification/styles";
import { FaSearch } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { proPage } from "../../apis/api";
import useAuthStore from "../../store/useAuthStore";

import {
  Container,
  Title,
  SearchContainer,
  SearchButton,
  FilterButtons,
  FilterButton,
  NoticeList,
  NoticeItem,
  NoticeHeader,
  Badge,
  NoticeTitle,
  ToggleButton,
  NoticeDetails,
  RegisterButton,
  PageButton,
  PaginationWrapper,
  MenuButton,
  Menu,
  Button,
  MenuWrapper,
} from "./styles";

/* =========================
   Modal styles (inline)
========================= */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
`;

const ModalText = styled.p`
  margin: 20px 0;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  background-color: ${(props) => (props.confirm ? "#FF7710" : "#FFFAF5")};
  color: ${(props) => (props.confirm ? "white" : "#FF7710")};
`;

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalText>정말 삭제하시겠습니까?</ModalText>
        <ButtonGroup>
          <ModalButton confirm onClick={onConfirm}>
            예
          </ModalButton>
          <ModalButton onClick={onClose}>아니오</ModalButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

const NoticeBoard = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ username
  const username = useAuthStore((state) => state.username);
  const [sessionUsername, setSessionUsername] = useState(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setSessionUsername(storedUsername);
      useAuthStore.getState().setUsername(storedUsername);
    }
  }, []);

  const currentUsername = username || sessionUsername;
  const isAdmin =
    currentUsername === "장지연" ||
    currentUsername === "김은지" ||
    currentUsername === "김슬기";

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState("전체");

  /* =========================
     ✅ 공지사항 데이터 가져오기 (FIXED)
  ========================= */
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await proPage.getNotice();

        // 디버깅 로그
        console.log("raw response:", response);
        console.log("response.data:", response?.data);
        console.log("response.data.data:", response?.data?.data);
        console.log(
          "type:",
          typeof response?.data?.data,
          "isArray:",
          Array.isArray(response?.data?.data)
        );

        const payload = response?.data?.data;

        // ✅ 다양한 응답 형태 안전 처리
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.list)
          ? payload.list
          : [];

        setNotices(list);
      } catch (error) {
        console.error("공지사항 데이터 가져오기 오류:", error);
        setError("데이터를 불러오는데 실패했습니다.");
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  /* =========================
     ✅ 필터링된 공지사항 (NULL SAFE)
  ========================= */
  const filteredNotices = Array.isArray(notices)
    ? notices.filter((notice) => {
        const q = (query ?? "").toLowerCase();

        const title = (notice?.title ?? "").toLowerCase();
        const content = (notice?.content ?? "").toLowerCase();

        const matchesSearch = title.includes(q) || content.includes(q);
        const matchesCategory =
          activeFilter === "전체" || notice?.type === activeFilter;

        return matchesSearch && matchesCategory;
      })
    : [];

  const noticesPerPage = 6;
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage) || 1;
  const startIndex = (currentPage - 1) * noticesPerPage;
  const currentNotices = filteredNotices.slice(
    startIndex,
    startIndex + noticesPerPage
  );

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest(".menu-wrapper") ||
        event.target.closest(".menu-button")
      ) {
        return;
      }
      if (showMenuIndex !== null) {
        setShowMenuIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenuIndex]);

  const toggleMenu = (index, e) => {
    e.stopPropagation();
    setShowMenuIndex(showMenuIndex === index ? null : index);
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    const notice = notices.find((n) => n.id === id);
    if (notice) {
      navigate("create", {
        state: {
          isEdit: true,
          noticeData: {
            id: notice.id,
            title: notice.title,
            content: notice.content,
            category: notice.type,
          },
        },
      });
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
    setShowMenuIndex(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await proPage.deleteNotice(deleteTargetId);
      console.log("삭제 응답:", response);

      if (
        response &&
        (response.status === 200 || response.status === 204 || response.data)
      ) {
        const updatedNotices = notices.filter(
          (notice) => notice.id !== deleteTargetId
        );
        setNotices(updatedNotices);
        alert("공지사항이 삭제되었습니다.");
      } else {
        console.error("삭제 실패 응답:", response);
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleButtonClick = () => {
    navigate("create");
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("날짜 포맷팅 오류:", e);
      return dateString;
    }
  };

  return (
    <Container>
      <Title>
        공지사항
        {isAdmin && (
          <RegisterButton onClick={handleButtonClick}>
            <IoMdAdd />
            공지 등록
          </RegisterButton>
        )}
      </Title>

      <SearchBox width="400px" height="50px">
        <SearchInput
          placeholder="검색어를 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <SearchIcon onClick={handleSearch}>
          <FaSearch />
        </SearchIcon>
      </SearchBox>

      <FilterButtons>
        {["전체", "출결", "공결", "훈련장려금", "규정", "긴급"].map((f) => (
          <FilterButton
            key={f}
            active={activeFilter === f}
            onClick={() => handleFilterChange(f)}
          >
            {f}
          </FilterButton>
        ))}
      </FilterButtons>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>로딩 중...</div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          {error}
        </div>
      ) : currentNotices.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          등록된 공지사항이 없습니다.
        </div>
      ) : (
        <NoticeList>
          {currentNotices.map((notice, index) => (
            <NoticeItem key={notice.id ?? index} active={showMenuIndex === index}>
              <NoticeHeader onClick={() => toggleDetails(index)}>
                {index + 1}. <Badge>{notice.type}</Badge>
                <NoticeTitle>{notice.title}</NoticeTitle>
                <ToggleButton>{openIndex === index ? "▲" : "▼"}</ToggleButton>

                {isAdmin && (
                  <MenuWrapper className="menu-wrapper">
                    <Button
                      className="menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(index, e);
                      }}
                    >
                      <FiMoreVertical size={24} />
                    </Button>

                    {showMenuIndex === index && (
                      <Menu>
                        <MenuButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(notice.id);
                          }}
                        >
                          수정
                        </MenuButton>
                        <MenuButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notice.id);
                          }}
                        >
                          삭제
                        </MenuButton>
                      </Menu>
                    )}
                  </MenuWrapper>
                )}
              </NoticeHeader>

              {openIndex === index && (
                <NoticeDetails className="notice-details-content">
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      lineHeight: "1.2",
                    }}
                  >
                    {notice.content}
                  </div>

                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                      color: "#666",
                      textAlign: "right",
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "15px",
                    }}
                  >
                    {notice.created_by && <span>작성자: {notice.created_by}</span>}

                    {(notice.created_at ||
                      notice.createdAt ||
                      notice.date ||
                      notice.created_date) && (
                      <span>
                        (
                        {formatDate(
                          notice.created_at ||
                            notice.createdAt ||
                            notice.date ||
                            notice.created_date
                        )}
                        )
                      </span>
                    )}
                  </div>
                </NoticeDetails>
              )}
            </NoticeItem>
          ))}
        </NoticeList>
      )}

      {!loading && !error && filteredNotices.length > 0 && (
        <PaginationWrapper>
          <PageButton
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀ 이전
          </PageButton>
          <span>
            {currentPage} / {Math.ceil(filteredNotices.length / noticesPerPage) || 1}
          </span>
          <PageButton
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredNotices.length / noticesPerPage)}
          >
            다음 ▶
          </PageButton>
        </PaginationWrapper>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Container>
  );
};

export default NoticeBoard;
