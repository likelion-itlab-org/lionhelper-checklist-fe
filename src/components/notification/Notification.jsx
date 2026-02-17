import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  Wrapper,
  Title,
  SearchBox,
  SearchInput,
  SearchIcon,
  ResultsContainer,
  QuestionBox,
  QuestionText,
  ToggleIcon,
  AnswerBox,
  PaginationContainer,
  PageButton,
  NotiText,
  EmptyText,
} from "./styles";
import { helper } from "../../apis/helper";

const Notification = () => {
  const [notiDatas, setNotiDatas] = useState([]);
  const [searchDatas, setSearchDatas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAnswers, setOpenAnswers] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    const getNoticeData = async () => {
      try {
        const response = await helper.getNotice();
        const list = response?.data?.data;

        if (Array.isArray(list)) {
          const mapped = list.map((item) => ({
            question: item?.question ?? item?.title ?? "",
            answer: item?.answer ?? item?.content ?? "",
          }));
          setNotiDatas(mapped);
        } else {
          setNotiDatas([]);
        }
      } catch (error) {
        console.error("공지 불러오기 실패:", error);
        setNotiDatas([]);
      }
    };

    getNoticeData();
  }, []);

  const handleSearchDatas = () => {
    const searchDataResults = Array(5)
      .fill(null)
      .map((_, index) => ({
        question: `${index + 1}. 관련질문 ${index + 1}`,
        answer: `A. 이 질문에 대한 답변 내용 ${index + 1}`,
      }));

    setSearchDatas(searchDataResults);
    setCurrentPage(1);
    setOpenAnswers([]);
    setIsSearched(true);
  };

  const toggleAnswer = (index) => {
    setOpenAnswers((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const resultsPerPage = 10;

  const paginatedSearchData = searchDatas.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const paginatedNotiData = notiDatas.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const currentDatas = isSearched ? paginatedSearchData : paginatedNotiData;
  const totalLength = isSearched ? searchDatas.length : notiDatas.length;

  return (
    <Wrapper>
      <Title>라이언 헬퍼</Title>

      <SearchBox>
        <SearchInput placeholder="라이언 헬퍼에게 무엇이든 물어보세요" />
        <SearchIcon onClick={handleSearchDatas}>
          <FaSearch />
        </SearchIcon>
      </SearchBox>

      <ResultsContainer>
        <NotiText>공지사항</NotiText>

        {currentDatas.length === 0 ? (
          <EmptyText>공지사항이 없습니다.</EmptyText>
        ) : (
          currentDatas.map((data, index) => (
            <div key={index}>
              <QuestionBox onClick={() => toggleAnswer(index)}>
                <QuestionText>
                  {index + 1}. {data.question}
                </QuestionText>
                <ToggleIcon>
                  {openAnswers.includes(index) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </ToggleIcon>
              </QuestionBox>

              {openAnswers.includes(index) && (
                <AnswerBox>{data.answer}</AnswerBox>
              )}
            </div>
          ))
        )}
      </ResultsContainer>

      <PaginationContainer>
        <PageButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          이전
        </PageButton>

        <PageButton
          disabled={currentPage * resultsPerPage >= totalLength || totalLength === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          다음
        </PageButton>
      </PaginationContainer>
    </Wrapper>
  );
};

export default Notification;
