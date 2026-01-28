import React, { useEffect, useState } from "react";
import useCourseStore from "../../store/useCourseStore";
// import useCourseStore from "../../store/useCourseStore";
import {
  Wrapper,
  DropdownContainer,
  DropdownIcon,
  DropdownList,
  DropdownItem,
} from "./styles";

const CourseDropDown = () => {
  const { courseItems, fetchCourseItems, selectedCourse, setSelectedCourse } =
    useCourseStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCourseItems(); // 데이터 가져오기
  }, [fetchCourseItems]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setDropdownOpen(false);
  };

  return (
    <Wrapper>
      <DropdownContainer onClick={() => setDropdownOpen(!dropdownOpen)}>
        {selectedCourse}
        <DropdownIcon />
        <DropdownList isOpen={dropdownOpen}>
          {courseItems.map((course) => (
            <DropdownItem
              key={course}
              onClick={() => handleCourseSelect(course)}
            >
              {course}
            </DropdownItem>
          ))}
        </DropdownList>
      </DropdownContainer>
    </Wrapper>
  );
};

export default CourseDropDown;
