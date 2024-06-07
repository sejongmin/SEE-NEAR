import { useState } from "react";
import styled from "styled-components";
import { SeniorInfoDto, SeniorPostInfo } from "@/dto/dto";

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: SeniorInfoDto;
  onSave: (userInfo: SeniorPostInfo) => void;
}

const UserInfoModal = ({
  isOpen,
  onClose,
  userInfo,
  onSave,
}: UserInfoModalProps) => {
  const [formData, setFormData] = useState(userInfo);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <InputBox>
            <FormLabel>생일 :</FormLabel>
            <Input
              type="date"
              name="senior_birth"
              value={formData.senior_birth}
              onChange={handleChange}
            />
          </InputBox>
          <InputBox>
            <FormLabel>성별 :</FormLabel>
            <Select
              name="senior_gender"
              value={formData.senior_gender}
              onChange={handleChange}
            >
              <option value="2">남성</option>
              <option value="1">여성</option>
              <option value="0">기타</option>
            </Select>
          </InputBox>
          <InputBox>
            <FormLabel>질병 :</FormLabel>
            <Input
              type="text"
              name="senior_diseases"
              value={formData.senior_diseases}
              onChange={handleChange}
            />
          </InputBox>
          <InputBox>
            <FormLabel>관심사 :</FormLabel>
            <Input
              type="text"
              name="senior_interests"
              value={formData.senior_interests}
              onChange={handleChange}
            />
          </InputBox>
          <ButtonWrapper>
            <Button type="submit">저장</Button>
            <Button onClick={onClose}>닫기</Button>
          </ButtonWrapper>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
`;

const FormLabel = styled.label`
  width: 60px;
  margin-right: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 250px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 268px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin: 10px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:first-of-type {
    margin-right: 10px;
  }

  &:hover {
    background-color: #0056b3;
  }
`;

const InputBox = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export default UserInfoModal;
