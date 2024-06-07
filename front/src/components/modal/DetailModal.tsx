import styled from "styled-components";
import { extractTime } from "@/utils/extractTime";
import Button from "../button/Button";
import { EventDto } from "@/dto/dto";
import { formatTimestampToString } from "@/utils/formatDateUtils";
interface EventsCheckResponse {
  id: number;
  title: string;
  location: string;
  datetime: string;
}

interface DetailModalProps {
  show: boolean;
  onClose: () => void;
  todo: EventsCheckResponse | null;
  handleDeleteEvent: (data: EventDto) => void;
}

const DetailModal = ({
  show,
  onClose,
  todo,
  handleDeleteEvent,
}: DetailModalProps) => {
  if (!show || !todo) {
    return null;
  }

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>{formatTimestampToString(todo.datetime)}의 일정</h2>
        <p>
          <strong>일정 제목 :</strong> {todo.title}
        </p>
        <p>
          <strong>장소 :</strong> {todo.location}
        </p>
        <p>
          <strong>시간 : </strong> {extractTime(todo.datetime)}
        </p>
        <ButtonWrapper>
          <CloseButton onClick={() => handleDeleteEvent(todo)}>
            삭제
          </CloseButton>
          <CloseButton onClick={onClose}>닫기</CloseButton>
        </ButtonWrapper>
      </ModalContent>
    </ModalBackdrop>
  );
};

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 300px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  padding: 10px;
  margin-top: 20px;
  align-self: center;
  background: gray;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export default DetailModal;
