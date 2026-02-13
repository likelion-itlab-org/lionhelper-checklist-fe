import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiHome } from "react-icons/fi";
import { RiNotification2Fill } from "react-icons/ri";
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { BiBarChart } from "react-icons/bi";
import { ImLab } from "react-icons/im";
import { FiPower } from "react-icons/fi"; // 상단에 import 추가
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Sidebar,
  Content,
  Logo,
  Title,
  NavList,
  NavItem,
  Icon,
  LogoutButton,
} from "./styles";
import useAuthStore from "../../store/useAuthStore";
import { Outlet } from "react-router-dom"; // ✅ Outlet을 가져오기!
import { proPage } from "../../apis/api";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuthStore();

  // 네비게이션 아이템 리스트 - /app 경로로 수정
  const menuItems = [
    // { id: "home", label: "홈", icon: <FiHome />, path: "/app" },
    // {
    //   id: "trainRegistration",
    //   label: "훈련과정 등록",
    //   icon: <IoIosAddCircle />,
    //   path: "/app/registration",
    // },
    {
      id: "checklist",
      label: "체크리스트",
      icon: <MdDashboard />,
      path: "/app/checklist/today",
    },
    {
      id: "admin",
      label: "어드민",
      icon: <MdAdminPanelSettings />,
      path: "/app/admin/teamTask",
    },
    {
      id: "notice",
      label: "공지사항",
      icon: <RiNotification2Fill />,
      path: "/app/notice",
    },
    // {
    //   id: "dashboard",
    //   label: "대시보드",
    //   icon: <BiBarChart />,
    //   path: "/app/dashboard/weekly",
    // },
    // {
    //   id: "laboratory",
    //   label: "AI 실험실",
    //   icon: <ImLab />,
    //   path: "/app/laboratory",
    // },
    // {
    //   id: "recruitment_status",
    //   label: "모집현황",
    //   icon: <BiBarChart />,
    //   path: "https://bootapplication.onrender.com/",
    //   isExternal: true,
    // },
  ];

  // 초기 active 상태 설정
  const [active, setActive] = useState("home");

  // location이 변경될 때마다 active 상태 업데이트
  useEffect(() => {
    // 현재 경로에 맞는 메뉴 아이템 찾기
    const findActiveMenuItem = () => {
      // 체크리스트 관련 경로인 경우
      if (location.pathname.startsWith("/app/checklist")) return "checklist";
      if (location.pathname.startsWith("/app/admin")) return "admin";

      // 정확히 일치하는 경로 찾기
      const exactMatch = menuItems.find(
        (item) => location.pathname === item.path
      );
      if (exactMatch) return exactMatch.id;

      // 경로가 시작하는 경우 찾기 (공지사항 제외)
      const startsWithMatch = menuItems.find(
        (item) =>
          item.id !== "notice" && location.pathname.startsWith(item.path)
      );
      if (startsWithMatch) return startsWithMatch.id;

      // 공지사항 관련 경로인 경우
      if (location.pathname.startsWith("/app/notice")) return "notice";

      return "home";
    };

    const activeId = findActiveMenuItem();
    setActive(activeId);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await proPage.postLogout();
      if (response.status === 200) {
        logout();
        navigate("/");
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <Layout>
      <Sidebar>
        <Logo
          src={process.env.PUBLIC_URL + "/likelion_logo.png"}
          alt="Logo"
          onClick={() => {
            setActive("checklist");
            navigate("/app/checklist/today");
          }}
          style={{ cursor: "pointer" }}
        />
        <Title>{username}님의 라이언헬퍼</Title>
        <NavList>
          {menuItems.map((item) => (
            <NavItem
              key={item.id}
              active={active === item.id}
              onClick={() => {
                setActive(item.id);
                if (item.isExternal) {
                  window.location.href = item.path;
                } else {
                  navigate(item.path);
                }
              }}
            >
              <Icon active={active === item.id}>{item.icon}</Icon>
              {item.label}
            </NavItem>
          ))}
        </NavList>
        <LogoutButton onClick={handleLogout}>
          <FiPower
            style={{
              marginRight: "5px",
              marginBottom: "6px",
              verticalAlign: "middle",
            }}
          />
          로그아웃
        </LogoutButton>
      </Sidebar>
    </Layout>
  );
};

export default Header;
