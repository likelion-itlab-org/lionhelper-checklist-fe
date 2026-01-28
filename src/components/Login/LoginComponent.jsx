import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import {
  Container,
  LoginBox,
  Logo,
  SubText,
  Input,
  LoginButton,
  ChangePasswordLink,
  PasswordChangeForm,
  PasswordChangeInput,
  PasswordChangeButton,
  PasswordChangeCancelButton,
  PasswordValidationMessage,
} from "./styles";
import { proPage } from "../../apis/api";
// import { proPage } from "/Users/parkseeun/Projects/lion-helper-v2/src/apis/api";

const LoginComponent = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [changeUsername, setChangeUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const navigate = useNavigate();
  const { postLogin, setUsername } = useAuthStore(); // Zustand에서 postLogin과 setUsername 가져오기
  const isFormValid = id.trim() !== "" && pw.trim() !== "";

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    // 영어, 숫자, 특수문자 조합 검사
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8) {
      return "비밀번호는 최소 8자 이상이어야 합니다.";
    }

    if (!hasLetter || !hasNumber || !hasSpecial) {
      return "비밀번호는 영어, 숫자, 특수문자를 모두 포함해야 합니다.";
    }

    return "";
  };

  const handleLogin = async () => {
    if (!isFormValid) {
      alert("아이디와 비밀번호를 입력해주세요");
      return;
    }

    const loginData = {
      username: id,
      password: pw,
    };

    try {
      const response = await proPage.postLogin(loginData);
      if (response && response.data && response.data.success) {
        // 로그인한 사용자의 username을 직접 저장
        const username = id; // 로그인에 사용한 id를 username으로 사용
        sessionStorage.setItem("username", username);
        setUsername(username); // Zustand store에 username 저장
        console.log("로그인 성공, 저장된 username:", username);
        navigate("/app/checklist/today");
      } else {
        // 로그인 실패 시 에러 메시지 표시
        if (response && response.data && response.data.message) {
          alert(response.data.message);
        } else {
          alert("아이디와 비밀번호를 다시 확인해주세요.");
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("아이디와 비밀번호를 다시 확인해주세요.");
      }
      console.error("로그인 오류:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isFormValid) {
      handleLogin();
    }
  };

  // 비밀번호 변경 처리 함수
  const handlePasswordChange = async () => {
    // 입력값 검증
    if (
      !changeUsername ||
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError("모든 필드를 입력해주세요.");
      return;
    }

    // 비밀번호 유효성 검사
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    // 새 비밀번호와 확인 비밀번호 일치 검사
    if (newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 변경 API 호출
    try {
      const changePasswordData = {
        username: changeUsername,
        current_password: currentPassword,
        new_password: newPassword,
      };

      const response = await proPage.changePassword(changePasswordData);

      if (response && response.status === 200) {
        setPasswordSuccess("비밀번호 변경 성공");
        setPasswordError("");

        // 폼 초기화
        setChangeUsername("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // 3초 후 비밀번호 변경 폼 닫기
        setTimeout(() => {
          setShowPasswordChange(false);
          setPasswordSuccess("");
        }, 3000);
      } else if (response && response.status === 400) {
        setPasswordError("필수 데이터 누락");
        setPasswordSuccess("");
      } else if (response && response.status === 401) {
        setPasswordError("현재 비밀번호가 일치하지 않음");
        setPasswordSuccess("");
      } else if (response && response.status === 500) {
        setPasswordError("서버 오류 발생");
        setPasswordSuccess("");
      } else {
        setPasswordError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
        setPasswordSuccess("");
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setPasswordError("비밀번호 변경 중 오류가 발생했습니다.");
      setPasswordSuccess("");
    }
  };

  // 비밀번호 변경 폼 취소
  const handlePasswordChangeCancel = () => {
    setShowPasswordChange(false);
    setChangeUsername("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  };

  return (
    <Container>
      <LoginBox onKeyDown={handleKeyDown}>
        <Logo>멋쟁이사자처럼 라이언헬퍼</Logo>
        <SubText>아이디와 비밀번호를 입력해주세요</SubText>
        <Input
          type="text"
          placeholder="아이디 입력"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <LoginButton onClick={handleLogin} disabled={!isFormValid}>
          로그인
        </LoginButton>

        <ChangePasswordLink onClick={() => setShowPasswordChange(true)}>
          비밀번호 변경
        </ChangePasswordLink>

        {showPasswordChange && (
          <PasswordChangeForm>
            <SubText>비밀번호 변경</SubText>
            <PasswordChangeInput
              type="text"
              placeholder="아이디 입력"
              value={changeUsername}
              onChange={(e) => setChangeUsername(e.target.value)}
            />
            <PasswordChangeInput
              type="password"
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <PasswordChangeInput
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <PasswordChangeInput
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {passwordError && (
              <PasswordValidationMessage error>
                {passwordError}
              </PasswordValidationMessage>
            )}

            {passwordSuccess && (
              <PasswordValidationMessage success>
                {passwordSuccess}
              </PasswordValidationMessage>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <PasswordChangeButton onClick={handlePasswordChange}>
                변경하기
              </PasswordChangeButton>
              <PasswordChangeCancelButton onClick={handlePasswordChangeCancel}>
                취소
              </PasswordChangeCancelButton>
            </div>
          </PasswordChangeForm>
        )}

        {/* <OptionBox>
            <label>
              <input type="checkbox" /> 로그인 유지
            </label>
            <a href="/find-password">비밀번호 찾기</a>
          </OptionBox> */}
      </LoginBox>
    </Container>
  );
};

export default LoginComponent;
