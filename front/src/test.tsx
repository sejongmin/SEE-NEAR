import React, { useState, useEffect, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { localInstance } from "./api/axios/axiosInstance";

interface Props {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setList: React.Dispatch<
    React.SetStateAction<{ prompt: string | null; bot: any }[]>
  >;
  list: { prompt: string | null; bot: any }[];
  isChatActive: boolean;
  setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chatbot: React.FC<Props> = ({
  isLoading,
  setIsLoading,
  setList,
  list,
  isChatActive,
  setIsChatActive,
}) => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<Blob | null>(null);
  const [return_audioUrl, set_return_AudioUrl] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [timerId, setTimerId] = useState<number | null>(null); // 타이머 아이디를 상태로 관리
  const [postId, setPostId] = useState<number | null>(null);

  const startRecording = () => {
    SpeechRecognition.startListening({ language: "ko-KR", continuous: true });
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.start();
        setCount(0);
        setStream(stream);
        setMediaRecorder(recorder);
        setAudioUrl(null); // Reset audio URL
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = useCallback(() => {
    SpeechRecognition.stopListening();
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }, [mediaRecorder, stream]);

  const startConversation = useCallback(async () => {
    try {
      const response = await localInstance.get("http://127.0.0.1:8000/conv/posts/create/");
      setPostId(response.data.id);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  }, [setPostId]);

  const endConversation = useCallback(async () => {
    setList([]);
    resetTranscript();
    if (timerId) { // timerId가 존재할 때만 clearInterval 호출
      clearInterval(timerId);
    }
    try {
      if (postId){
        const url = `http://127.0.0.1:8000/conv/posts/update/${postId}`
        const response = await localInstance.put(url, {});
        const message = response.data.message;
        console.log(message);
        setPostId(null);
      }
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }, [postId, resetTranscript, setList, timerId]);

  const sendMessage = useCallback(async () => {
    try {
      if (audioUrl && transcript && transcript.trim() !== '') {
        setList(prevList => [...prevList, { prompt: transcript, bot: null }]);
        const formData = new FormData();
        formData.append('text', transcript);
        formData.append("audio", audioUrl);
        const response = await localInstance.post(
          "http://127.0.0.1:8000/api/chatbot/",
          formData,
          { responseType: "blob" }
        );
        if (response.status === 200) {
          set_return_AudioUrl(response.data);
        } else {
          console.error('Failed to get audio file:', response.statusText);
        }
        resetTranscript();
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }, [resetTranscript, setList, transcript, audioUrl]);

  useEffect(() => {
    if (listening) {
      const id = setInterval(() => {
        setCount((count) => {
          const newCount = count + 1;
          if (transcript) {
            if (newCount === 2) {
              clearInterval(id);
              console.log(transcript);
              stopRecording();
            }
          } else {
            if (newCount === 10) {
              clearInterval(id);
              setIsChatActive(false);
            }
          }
          return newCount;
        });
      }, 1000);
      setTimerId((id: number | null) => id); // 타이머 아이디 설정
      return () => clearInterval(id);
    }
  }, [listening, transcript, count]);

  useEffect(() => {
    setCount(0)
  }, [transcript])

  useEffect(() => {
    if (listening && mediaRecorder) {
      mediaRecorder.ondataavailable = (e) => {
        setAudioUrl(e.data);
      };
    }
  }, [listening, mediaRecorder]);

  useEffect(() => {
    if (audioUrl) {
      sendMessage();
    }
  }, [audioUrl])

  useEffect(() => {
    if (return_audioUrl) {
      const audioBlob = new Blob([return_audioUrl], { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(url);
      audioElement.setAttribute('crossorigin', 'anonymous');
      audioElement.addEventListener('canplaythrough', () => {
        audioElement.play().then(() => {
          // Playback started successfully
        }).catch((error) => {
          console.error('Error playing audio:', error);
        });
      });
      audioElement.addEventListener('error', (error) => {
        console.error('Error loading audio:', error);
      });
      audioElement.addEventListener('ended', () => {
        setTimeout(() => {
          startRecording();
        }, 1000);
      });
    }
  }, [return_audioUrl]);

  useEffect(() => {
    if (isChatActive) {
      startConversation();
      startRecording();
    } else if (!isChatActive) {
      stopRecording();
      endConversation();
    }
  }, [isChatActive]);

  return (
    <>
      {isChatActive && (
        <div>
          <p>입력: {transcript}</p>
          <p>timer: {count}</p>
        </div>
      )}
    </>
  );
};

export default Chatbot;
