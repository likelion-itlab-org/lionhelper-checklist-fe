import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
`;

const Title = styled.h1`
  color: #ff7710;
  font-size: 100px;
  font-family: "Suite", sans-serif;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: ${(props) => props.width || "730px"};
  height: ${(props) => props.height || "70px"};
  background-color: white;
  border: 1px solid #d3d3d3;
  border-radius: 30px;
  padding: 0 30px;
  margin-top: 30px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  color: #9e9e9e;
  background: none;

  &::placeholder {
    color: #9e9e9e;
  }
`;

const SearchIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #9e9e9e;
  font-size: 24px;

  &:hover {
    color: #ff7710;
  }
`;

const ResultsContainer = styled.div`
  width: 750px;
  margin-top: 20px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const NotiText = styled.div`
  font-size: 25px;
  font-family: "Pretandard", sans-serif;
  font-weight: 500;
  color: #000;
`;

const EmptyText = styled.div`
  text-align: center;
  margin-top: 60px;
  font-size: 18px;
  font-family: "Pretandard", sans-serif;
  color: #9e9e9e;
`;

const QuestionBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #d9d9d9;
  margin-top: 3%;
  cursor: pointer;
`;

const QuestionText = styled.div`
  font-size: 22px;
  font-family: "Pretandard", sans-serif;
  color: #000;
`;

const ToggleIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnswerBox = styled.div`
  width: 715px;
  border-radius: 10px;
  background-color: #f6f6f6;
  margin: 10px 0 20px;
  padding: 15px;
  font-size: 16px;
  font-family: "Pretandard", sans-serif;
  color: #000;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  padding: 10px;
  margin: 0 5px;
  border: 1px solid #fff;
  border-radius: 10px;
  background-color: #fff;
  cursor: pointer;
  font-family: "Pretandard", sans-serif;

  &:hover {
    background-color: #f0f0f0;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export {
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
};
