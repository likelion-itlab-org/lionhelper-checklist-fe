import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  min-height: 300px;
  border-radius: 16px;
  padding: 24px;
  font-family: Pretendard, sans-serif;
  margin: 2% auto;
  flex-grow: 1;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const UncheckedContainer = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  max-width: 1200px;
  padding: 24px;
  font-family: Pretendard, sans-serif;
  margin: 2% auto;
  flex-grow: 1;
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
`;

const TableWrapper = styled.div`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
`;

const TableHead = styled.thead`
  background-color: #f8fafc;
  color: #1e293b;
`;

const TableRow = styled.tr`
  background-color: ${({ $active }) => ($active ? "rgba(255, 202, 162, 0.8)" : "transparent")};

  &:nth-child(even) {
    background-color: ${({ $active }) =>
      $active ? "rgba(255, 202, 162, 0.8)" : "#f8fafc"};
  }

  &:hover {
    background-color: ${({ $active }) =>
      $active ? undefined : "#f1f5f9"};
    transition: background-color 0.2s ease-in-out;
  }
`;



const TableHeader = styled.th`
  padding: 16px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: 16px;
  text-align: center;
  font-size: 18px;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  line-height: 1.5;
`;

const TableUrgencyCell = styled.td`
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UrgencyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: ${({ urgent }) => (urgent ? "#22c55e" : "#ef4444")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SolveBox = styled.div`
  cursor: pointer;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  background: #ffffff;
  font-size: 15px;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #ff7710;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ea580c;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export {
  TableWrapper,
  Title,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
  TableUrgencyCell,
  UrgencyBadge,
  UncheckedContainer,
  SubmitButton,
  SolveBox,
};
