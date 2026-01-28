// import React from "react";
// import styled from "styled-components";
// import { NavLink, useNavigate } from "react-router-dom";
// import useAuthStore from "../../store/useAuthStore";

// // 헤더 스타일
// const HeaderContainer = styled.header`
//   /* width: 1440px;
//   height: 99px;
//   background-color: #fff;
//   border-bottom: 2px solid #d6d6d6;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0 20px; */

//   width: 100%;
//   height: 80px;
//   background-color: #fff;
//   border-bottom: 1px solid #d6d6d6;
//   display: flex;
//   /* justify-content: space-between; 좌우 배치 */
//   align-items: center;
//   padding: 0 10px;
// `;

// // 로고 스타일
// const Logo = styled.img`
//   width: 161px;
//   height: 18px;
//   margin-left: 50px;
//   cursor: pointer;

//   @media (max-width: 768px) {
//     width: 120px; /* 모바일에서 로고 크기 조정 */
//     height: auto;
//   }
// `;

// // 내비게이션 스타일
// const Nav = styled.nav`
//   display: flex;
//   gap: 20px;
//   margin-left: 80px; /* 로고 기준 30px 공백 */
//   flex-grow: 1; /* 나머지 공간을 차지해서 로그인 버튼을 오른쪽으로 밀어줌 */
// `;

// // 네비게이션 링크 스타일
// const NavItem = styled(NavLink)`
//   font-family: "Pretandard", sans-serif;
//   font-size: 22px;
//   text-decoration: none;
//   margin-right: 20px;
//   color: black;

//   &.active {
//     color: #ff7710;
//   }
// `;

// // 네비게이션 링크 스타일
// const NavLogin = styled.button`
//   font-family: "Pretandard", sans-serif;
//   font-size: 22px;
//   text-decoration: none;
//   margin-right: 50px;
//   color: #ff7710;

//   background-color: transparent;
//   border-color: transparent;
//   cursor: pointer;

//   &.active {
//     color: #ff7710;
//   }
// `;

// // 로그인 버튼 스타일
// const LoginButton = styled(NavLink)`
//   font-family: "Pretandard", sans-serif;
//   font-size: 22px;
//   text-decoration: none;
//   margin-right: 20px;
//   color: #ff7710;
//   margin-right: 5%;
// `;

// const Header = ({ children }) => {
//   const { username, setUsername } = useAuthStore();
//   const navigate = useNavigate();

//   return (
//     <HeaderContainer>
//       {/* 왼쪽 로고 */}
//       <Logo
//         src={process.env.PUBLIC_URL + "/likelion_logo.png"}
//         alt="Logo"
//         onClick={() => navigate("/")}
//         style={{ cursor: "pointer" }} // 클릭 가능하게 설정
//       />{" "}
//       {/* 중앙 메뉴 */}
//       <Nav>
//         <NavItem to="/" exact activeClassName="active">
//           홈
//         </NavItem>
//         {children} {/* ✅ children을 추가해야 Search가 렌더링됨 */}
//         <NavItem to="/pro" activeClassName="active">
//           프로
//         </NavItem>
//         <NavItem to="/admin" activeClassName="active">
//           어드민
//         </NavItem>
//         {/* <NavItem to="/notice" activeClassName="active">
//           공지사항
//         </NavItem> */}
//         {children} {/* ✅ children을 추가해야 Search가 렌더링됨 */}
//       </Nav>
//       <NavLogin onClick={() => navigate("/login")}>로그인</NavLogin>
//       {/* {username ? (
//         <NavLogin>로그아웃</NavLogin>
//       ) : (
//         <NavLogin onClick={() => navigate("/login")}>로그인</NavLogin>
//       )} */}
//     </HeaderContainer>
//   );
// };

// export default Header;
