import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { styled } from "styled-components";
import Emotion1Img from "@/assets/images/emoji1.svg";
import Emotion2Img from "@/assets/images/emoji2.svg";
import Emotion3Img from "@/assets/images/emoji3.svg";
import Emotion4Img from "@/assets/images/emoji4.svg";
import Emotion5Img from "@/assets/images/emoji5.svg";
import { formatDate } from "@/utils/formatDateUtils";
import { selectedDateState } from "@/recoil/atom";
import { useRecoilState } from "recoil";

const CalendarFunc = () => {
  const [value, setValue] = useRecoilState(selectedDateState);
  const onClickDay = (date: Date) => {
    setValue(date);
    console.log("Selected date:", formatDate(date));
  };

  const test1Day = [
    "2024-05-11",
    "2024-05-29",
    "2024-05-28",
    "2024-05-18",
    "2024-05-12",
  ];

  const test2Day = ["2024-05-14", "2024-05-01", "2024-05-22", "2024-05-17"];
  const test3Day = ["2024-05-19"];
  const test4Day = ["2024-05-05", "2024-05-16"];
  const test5Day = ["2024-05-10"];

  return (
    <StyleCalendar
      onClickDay={onClickDay}
      value={value}
      formatDay={(locale, date) => date.getDate().toString()} //날짜에서 "일"빼고 숫자만 보여주기
      minDetail="year" // 10년단위 년도 숨기기
      next2Label={null} // +1년 & +10년 이동 버튼 숨기기
      prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
      showNeighboringMonth={false} //앞뒤 달의 이어지는 날짜 보여주기 여부
      tileContent={({ date }) => {
        const html = [];
        if (test1Day.find((x) => x === formatDate(date))) {
          html.push(<EmotionImg src={Emotion1Img} key={formatDate(date)} />);
        } else if (test2Day.find((x) => x === formatDate(date))) {
          html.push(<EmotionImg src={Emotion2Img} key={formatDate(date)} />);
        } else if (test3Day.find((x) => x === formatDate(date))) {
          html.push(<EmotionImg src={Emotion3Img} key={formatDate(date)} />);
        } else if (test4Day.find((x) => x === formatDate(date))) {
          html.push(<EmotionImg src={Emotion4Img} key={formatDate(date)} />);
        } else if (test5Day.find((x) => x === formatDate(date))) {
          html.push(<EmotionImg src={Emotion5Img} key={formatDate(date)} />);
        } else {
          html.push(<BasicDotStyled key={formatDate(date)} />);
        }
        return <>{html}</>;
      }}
    />
  );
};

export const StyleCalendar = styled(Calendar)`
  width: 700px;
  padding: 20px;
  border: none;
  background-color: var(--background-color);
  line-height: 2.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .react-calendar__month-view__weekdays {
    font-size: 1rem;
  }

  .react-calendar__tile,
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: none;
    color: black;
  }
  .react-calendar__navigation button {
    font-size: 1.8rem;
  }

  .react-calendar__navigation button:hover,
  .react-calendar__navigation button:focus {
    background: none;
  }
  .react-calendar__navigation__prev-button,
  .react-calendar__navigation__next-button {
    border: 1.2px solid #eaeaea;
    border-radius: 15px;
  }

  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
  }
`;

const EmotionImg = styled.img`
  width: 3rem;
  height: 3rem;
  margin-top: -5px;
`;

const BasicDotStyled = styled.div`
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  background-color: #eaeaea;
  margin-top: -5px;
`;
export default CalendarFunc;
