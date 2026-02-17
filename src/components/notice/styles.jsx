import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 270px);
  margin-left: 270px;
  min-height: 100vh;
  padding: 2rem;
  margin-top: 50px;
`;

const Title = styled.h2`
  color: #1a1a1a;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  font-size: 1.75rem;
  font-weight: 700;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 800px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #ff7710;
    box-shadow: 0 0 0 3px rgba(255, 119, 16, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const SearchButton = styled.button`
  padding: 8px;
  background-color: white;
  border: none;
  cursor: pointer;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.active ? "#ff7710" : "#fff")};
  border: 1px solid ${(props) => (props.active ? "#ff7710" : "#e0e0e0")};
  color: ${(props) => (props.active ? "white" : "#666")};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#ff7710" : "#fff4eb")};
    border-color: #ff7710;
    color: ${(props) => (props.active ? "white" : "#ff7710")};
  }
`;

const NoticeList = styled.div`
  margin-top: 1rem;
  position: relative;
  width: 100%;
  max-width: 800px;
`;

const NoticeItem = styled.div`
  width: 100%;
  border: 1px solid #e0e0e0;
  margin-bottom: 1rem;
  border-radius: 12px;
  position: relative;
  z-index: ${(props) => (props.active ? 1001 : 1)};
  background-color: white;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const NoticeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  cursor: pointer;
  position: relative;
`;

const Badge = styled.span`
  background-color: #fff4eb;
  color: #ff7710;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const NoticeTitle = styled.span`
  flex: 1;
  font-weight: 500;
  margin-left: 1rem;
  color: #333;
`;

const ToggleButton = styled.span`
  font-size: 0.85rem;
  color: #666;
  margin: 0 0.5rem;
`;

const NoticeDetails = styled.div`
  background-color: #f8f9fa;
  padding: 1.25rem;
  font-size: 0.95rem;
  color: #444;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  line-height: 1.5;
`;

const RegisterButton = styled.button`
  background-color: #fff4eb;
  color: #ff7710;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff7710;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 119, 16, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1.25rem;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  margin-top: 1rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  color: #666;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: #ff7710;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
  z-index: 1;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 8rem;
  background-color: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  z-index: 1;
`;

const MenuButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #333;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fff4eb;
    color: #ff7710;
  }
`;

const Button = styled.button`
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 1;
  color: #666;
  transition: color 0.2s ease;

  &:hover {
    color: #ff7710;
  }
`;

export {
  Container,
  Title,
  SearchContainer,
  SearchInput,
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
  PaginationWrapper,
  PageButton,
  Menu,
  MenuButton,
  Button,
  MenuWrapper,
};
