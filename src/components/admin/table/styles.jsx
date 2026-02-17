import styled from "styled-components";

export const Container = styled.div`
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

export const UncheckedContainer = styled.div`
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

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
`;

export const TableWrapper = styled.div`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
`;

export const TableHead = styled.thead`
  background-color: #f8fafc;
  color: #1e293b;
`;

export const TableRow = styled.tr`
  background-color: ${({ $active }) =>
    $active ? "rgba(255, 202, 162, 0.8)" : "transparent"};

  &:nth-child(even) {
    background-color: ${({ $active }) =>
      $active ? "rgba(255, 202, 162, 0.8)" : "#f8fafc"};
  }

  &:hover {
    background-color: ${({ $active }) => ($active ? undefined : "#f1f5f9")};
    transition: background-color 0.2s ease-in-out;
  }
`;

export const TableHeader = styled.th`
  padding: 16px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
`;

export const TableCell = styled.td`
  padding: 16px;
  text-align: center;
  font-size: 18px;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  line-height: 1.5;
`;

export const TableUrgencyCell = styled.td`
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const UrgencyBadge = styled.span`
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

export const SolveBox = styled.div`
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

export const SubmitButton = styled.button`
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

export const ClickableRow = styled(TableRow)`
  cursor: pointer;
`;


export const ExpandedArea = styled.div`
  padding: 24px;
  background: #fff7ed;
  border-bottom: 1px solid #e2e8f0;
`;

export const EmptyText = styled.div`
  color: #666;
`;

export const IssuesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const IssueItem = styled.li`
  &:not(:first-child) {
    padding-top: 12px;
    margin-top: 12px;
    border-top: 1px solid #e5e7eb;
  }
`;

export const IssueHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  font-size: 18px;
  font-weight: 700;
`;

export const DateBadge = styled.span`
  margin-right: 8px;
  padding: 2px 12px;
  border-radius: 9999px;
  background: #ff7710;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const IssueContent = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
`;

export const CommentToggleRow = styled.div`
  margin-top: 10px;
`;

export const CommentToggleButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #717376;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 2px;
`;

export const Chevron = styled.span`
  color: #717376;
  font-size: 20px; 
  font-weight: 700;
  line-height: 1;
`;

export const CommentsBox = styled.div`
  margin-top: 12px;
  margin-left: 18px;
  padding: 14px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
`;

export const CommentsLoadingText = styled.div`
  color: #64748b;
  padding: 10px 10px;
`;

export const CommentsEmptyText = styled.div`
  color: #64748b;
  padding: 10px 10px;
`;

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CommentItem = styled.div`
  padding: 12px 10px;

  &:not(:first-child) {
    border-top: 1px solid #eef2f7;
  }
`;

export const CommentMetaRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
`;

export const CommentAuthor = styled.div`
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CommentDate = styled.div`
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
`;

export const CommentBody = styled.div`
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
`;

export const CommentFormRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const CommentInput = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  outline: none;

  &:focus {
    border-color: #ff7710;
    box-shadow: 0 0 0 3px rgba(255, 119, 16, 0.15);
  }
`;

export const CommentSubmitButton = styled.button`
  height: 44px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  background: #ff7710;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: #ea580c;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;

export const HintText = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #94a3b8;
`;
