import { instance, signupInstance } from "@/api/axios/axiosInstance";
import { EventDto, ConversationDto, UsetInfoDto } from "@/dto/dto";

export const axiosEventsCreate = async (
  title: string,
  location: string,
  datetime: string
): Promise<EventDto> => {
  const response = await instance.post<EventDto>("/events/create", {
    title,
    location,
    datetime,
  });
  return response.data;
};

export const axiosEventsCheck = async (date: string): Promise<EventDto[]> => {
  try {
    const response = await instance.get<EventDto[]>(`/events/${date}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const axiosFetchEvent = async (id: number): Promise<EventDto> => {
  try {
    const response = await instance.get<EventDto>(`/events/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const axiosUpdateEvent = async (
  id: number,
  title: string,
  location: string,
  datetime: string
): Promise<EventDto> => {
  try {
    const body = { title, location, datetime };
    const response = await instance.put<EventDto>(`/events/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const axiosDeleteEvent = async (id: number): Promise<void> => {
  try {
    await instance.delete(`/events/${id}`);
  } catch (error) {
    throw error;
  }
};

export const axiosConvList = async (
  date: string
): Promise<ConversationDto[]> => {
  try {
    const response = await instance.get<ConversationDto[]>(
      `/conv/posts/${date}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const axiosFetchConv = async (id: number): Promise<ConversationDto> => {
  try {
    const response = await instance.get<ConversationDto>(`/conv/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const axiosDeleteConv = async (id: number): Promise<void> => {
  try {
    await instance.delete(`/conv/posts/${id}`);
  } catch (error) {
    throw error;
  }
};

interface ApiResponse {
  token: string;
}
export const axiosLogin = async (
  username: string,
  password: string
): Promise<ApiResponse> => {
  const response = await signupInstance.post<ApiResponse>("/auth/user/login/", {
    username,
    password,
  });
  return response.data;
};

interface ApiJoinResponse {
  token: string;
  user: UsetInfoDto;
}

export const axiosJoin = async (
  username: string,
  password: string,
  email: string,
  first_name: string,
  last_name: string,
  phone_number: string,
  birth: string,
  is_senior: boolean,
  family_id?: string,
  role?: string
): Promise<ApiJoinResponse> => {
  const response = await signupInstance.post<ApiJoinResponse>(
    "/auth/user/signup",
    {
      username,
      password,
      email,
      first_name,
      phone_number,
      birth,
      is_senior,
      last_name,
      family_id,
      role,
    }
  );
  return response.data;
};
