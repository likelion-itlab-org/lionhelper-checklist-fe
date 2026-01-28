import React, { useState } from "react";
import { proPage } from "../../apis/api";
import {
  Container,
  Title,
  Subtitle,
  Label,
  TimeInputContainer,
  TimeInputWrapper,
  TimeInput,
  ClockIcon,
  SubmitButton,
  Message,
  IconContainer,
  PlusIcon,
  MinusIcon,
  TitleContainer,
  DownloadButton,
} from "./styles";
import useCourseStore from "../../store/useCourseStore";

const AttendanceRecord = ({ selectedDate }) => {
  const { selectedCourse } = useCourseStore(); // 선택된 과정 가져오기

  const [dateInputError, setDateInputError] = useState();
  const [courseInputMessage, setCouresInputMessage] = useState();
  const [courseInputError, setCouresInputError] = useState();

  // 주강사 상태
  const [mainInstructors, setMainInstructors] = useState([
    { startTime: "", endTime: "" },
  ]);
  const [mainMessages, setMainMessages] = useState([]);
  const [mainErrors, setMainErrors] = useState([]);
  const [mainInstructorNames, setMainInstructorNames] = useState([""]);

  // 보조강사 상태
  const [subInstructors, setSubInstructors] = useState([
    { startTime: "", endTime: "" },
  ]);
  const [subMessages, setSubMessages] = useState([]);
  const [subErrors, setSubErrors] = useState([]);
  const [subInstructorNames, setSubInstructorNames] = useState([""]);

  const handleTimeChange = (index, role, field, value) => {
    const updateList =
      role === "main" ? [...mainInstructors] : [...subInstructors];
    const cleanedValue = value.replace(/[^0-9]/g, "").slice(0, 4);
    if (cleanedValue.length === 4) {
      updateList[index][field] = cleanedValue.replace(
        /(\d{2})(\d{2})/,
        "$1:$2"
      );
    } else {
      updateList[index][field] = cleanedValue;
    }
    role === "main"
      ? setMainInstructors(updateList)
      : setSubInstructors(updateList);
  };

  const addInstructor = (role) => {
    if (role === "main") {
      setMainInstructors([...mainInstructors, { startTime: "", endTime: "" }]);
      setMainMessages([...mainMessages, ""]);
      setMainErrors([...mainErrors, false]);
    } else {
      setSubInstructors([...subInstructors, { startTime: "", endTime: "" }]);
      setSubMessages([...subMessages, ""]);
      setSubErrors([...subErrors, false]);
    }
  };

  const removeInstructor = (role, index) => {
    if (role === "main") {
      if (mainInstructors.length <= 1) return; // 주강사가 1명 이하라면 삭제 불가
      setMainInstructors(mainInstructors.filter((_, i) => i !== index));
      setMainMessages(mainMessages.filter((_, i) => i !== index));
      setMainErrors(mainErrors.filter((_, i) => i !== index));
      setMainInstructorNames(mainInstructorNames.filter((_, i) => i !== index));
    } else {
      if (subInstructors.length <= 1) return; // 보조강사가 1명 이하라면 삭제 불가
      setSubInstructors(subInstructors.filter((_, i) => i !== index));
      setSubMessages(subMessages.filter((_, i) => i !== index));
      setSubErrors(subErrors.filter((_, i) => i !== index));
      setSubInstructorNames(subInstructorNames.filter((_, i) => i !== index));
    }
  };

  // 초기 상태를 빈 배열로 명확히 설정

  const handleSubmit = async (role, index) => {
    console.log("index", index);
    const timeFormat = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    let instructors, instructorNames, setMessages, setErrors, messages, errors;

    if (role === "main") {
      instructors = mainInstructors;
      instructorNames = mainInstructorNames;
      setMessages = setMainMessages;
      setErrors = setMainErrors;
      messages = [...(mainMessages ?? [])]; // null 또는 undefined 방지
      errors = [...(mainErrors ?? [])]; // null 또는 undefined 방지
    } else {
      instructors = subInstructors;
      instructorNames = subInstructorNames;
      setMessages = setSubMessages;
      setErrors = setSubErrors;
      messages = [...(subMessages ?? [])];
      errors = [...(subErrors ?? [])];
    }

    if (selectedCourse === "과정 선택") {
      messages[index] = "과정을 선택해 주세요.";
      errors[index] = true;
      setMessages([...messages]);
      setErrors([...errors]);
      return;
    }

    // 주강사/보조강사명이 입력되지 않은 경우 추가
    if (!instructorNames[index] || instructorNames[index].trim() === "") {
      messages[index] =
        role === "main" ? "주강사명을 입력하세요!" : "보조강사명을 입력하세요!";
      errors[index] = true;
      setMessages([...messages]);
      setErrors([...errors]);
      return;
    }

    const checkIn = instructors[index].startTime;
    const checkOut = instructors[index].endTime;

    if (!checkIn.match(timeFormat)) {
      messages[index] = "출근 시간을 입력해주세요! (예: 09:00)";
      errors[index] = true;
      setMessages([...messages]);
      setErrors([...errors]);
      return;
    }
    if (!checkOut.match(timeFormat)) {
      messages[index] = "퇴근 시간을 입력해주세요! (예: 18:00)";
      errors[index] = true;
      setMessages([...messages]);
      setErrors([...errors]);
      return;
    }

    const requestData = {
      check_in: instructors[index].startTime,
      check_out: instructors[index].endTime,
      daily_log: true,
      date: new Date().toISOString().split("T")[0], // 오늘 날짜 설정
      instructor: role === "main" ? "1" : "2",
      instructor_name: instructorNames[index] || "", // 보조강사도 입력할 수 있도록 추가
      training_course: selectedCourse,
    };

    try {
      console.log("res", requestData);
      const response = await proPage.attendance(requestData);
      if (response.status === 201) {
        messages[index] = "출퇴근 기록이 제출되었습니다.";
        errors[index] = false;
      } else {
        messages[index] = "제출 중 오류가 발생했습니다. 다시 시도해 주세요.";
        errors[index] = true;
      }
    } catch (error) {
      messages[index] = "서버와의 연결에 문제가 발생했습니다.";
      errors[index] = true;
    }

    setMessages([...messages]);
    setErrors([...errors]);
  };

  const handleInstructorNameChange = (role, index, value) => {
    if (role === "main") {
      setMainInstructorNames((prev) => {
        const updatedNames = [...prev];
        updatedNames[index] = value;
        return updatedNames;
      });
    } else {
      setSubInstructorNames((prev) => {
        const updatedNames = [...prev];
        updatedNames[index] = value;
        return updatedNames;
      });
    }
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0]); // 첫 번째 객체의 키를 CSV 헤더로 사용
    const csvRows = [];

    csvRows.push(headers.join(",")); // 헤더 추가

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        return typeof value === "string" ? `"${value}"` : value; // 문자열이면 따옴표 추가
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n"); // 줄바꿈으로 합치기
  };

  const handleDownload = async () => {
    try {
      const response = await proPage.getAttendance();

      // 1️⃣ 응답 객체가 정상인지 확인
      if (!response || !response.data) {
        alert("출퇴근 기록이 없습니다.");
        return;
      }

      // 2️⃣ 응답 데이터가 배열인지 확인 (객체라면 배열로 변환)
      const attendanceData = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // 3️⃣ 데이터가 비어있다면 처리
      if (attendanceData.length === 0) {
        alert("출퇴근 기록이 없습니다.");
        return;
      }

      // 4️⃣ JSON 데이터를 CSV로 변환
      const csvData = convertToCSV(attendanceData);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_records.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      alert("오류 발생: " + error.message);
    }
  };

  return (
    <Container>
      <TitleContainer>
        <Title>🕕 강사/보조강사 출퇴근 기록</Title>
        {/* <DownloadButton onClick={handleDownload}>기록 다운로드</DownloadButton> */}
      </TitleContainer>{" "}
      <Subtitle>수업 종료 후 18시에 강사 출/퇴근 기록을 입력해주세요!</Subtitle>
      {/* 주강사 입력 필드 */}
      {mainInstructors.map((instructor, index) => (
        <TimeInputContainer key={`main-${index}`}>
          <PlusIcon onClick={() => addInstructor("main")} />

          <Label>주강사 {index + 1}</Label>
          <TimeInputWrapper>
            <TimeInput
              type="text"
              placeholder="주강사명"
              value={mainInstructorNames[index]}
              onChange={(e) =>
                handleInstructorNameChange("main", index, e.target.value)
              }
            />
          </TimeInputWrapper>
          <TimeInputWrapper>
            <TimeInput
              type="text"
              placeholder="출근 시간"
              value={instructor.startTime}
              onChange={(e) =>
                handleTimeChange(index, "main", "startTime", e.target.value)
              }
            />
            <ClockIcon />
          </TimeInputWrapper>
          <TimeInputWrapper>
            <TimeInput
              type="text"
              placeholder="퇴근 시간"
              value={instructor.endTime}
              onChange={(e) =>
                handleTimeChange(index, "main", "endTime", e.target.value)
              }
            />
            <ClockIcon />
          </TimeInputWrapper>
          <SubmitButton onClick={() => handleSubmit("main", index)}>
            입력
          </SubmitButton>
          <IconContainer>
            <MinusIcon onClick={() => removeInstructor("main", index)} />
          </IconContainer>
          {mainMessages[index] && (
            <Message error={mainErrors[index]}>{mainMessages[index]}</Message>
          )}
        </TimeInputContainer>
      ))}
      {/* 보조강사 입력 필드 */}
      {subInstructors.map((instructor, index) => (
        <TimeInputContainer key={`sub-${index}`}>
          <PlusIcon onClick={() => addInstructor("sub")} />
          <Label>보조강사 {index + 1}</Label>
          <TimeInputWrapper>
            <TimeInput
              type="text"
              placeholder="보조강사명"
              value={subInstructorNames[index]}
              onChange={(e) =>
                handleInstructorNameChange("sub", index, e.target.value)
              }
            />
          </TimeInputWrapper>
          <TimeInputWrapper>
            <TimeInput
              type="text"
              placeholder="출근 시간"
              value={instructor.startTime}
              onChange={(e) =>
                handleTimeChange(index, "sub", "startTime", e.target.value)
              }
            />
            <ClockIcon />
          </TimeInputWrapper>
          <TimeInputWrapper>
            <TimeInput
              type="text"
              placeholder="퇴근 시간"
              value={instructor.endTime}
              onChange={(e) =>
                handleTimeChange(index, "sub", "endTime", e.target.value)
              }
            />
            <ClockIcon />
          </TimeInputWrapper>
          <SubmitButton onClick={() => handleSubmit("sub", index)}>
            입력
          </SubmitButton>
          <IconContainer>
            <MinusIcon onClick={() => removeInstructor("sub", index)} />
          </IconContainer>
          {subMessages[index] && (
            <Message error={subErrors[index]}>{subMessages[index]}</Message>
          )}
        </TimeInputContainer>
      ))}
    </Container>
  );
};

export default AttendanceRecord;
