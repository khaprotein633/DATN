import React, { useState, useEffect } from "react";
import {
  FloatButton,
  Drawer,
  Input,
  Button,
  Avatar,
  Typography,
  Spin,
} from "antd";

import {
  MessageOutlined,
  UserOutlined,
  RobotOutlined,
} from "@ant-design/icons";

import {
  getAnswerFromAI
} from "../../services/chatbotService";


const { Text } = Typography;
const { TextArea } = Input;

const Chatbox = () => {
  const [open, setOpen] = useState(false);

  const defaultMessage = [
    {
      sender: "bot",
      text: "Xin chào! Tôi là trợ lý học tập. Hãy hỏi tôi bất cứ điều gì liên quan đến các môn học trong hệ thống.",
    },
  ];

  const [messages, setMessages] = useState(defaultMessage);

  // const [messages, setMessages] = useState(() => {
  //   const saved = localStorage.getItem("chat_history");

  //   return saved ? JSON.parse(saved) : defaultMessage;
  // });

  useEffect(() => {
    localStorage.setItem(
      "chat_history",
      JSON.stringify(messages)
    );
  }, [messages]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    const newMessages = [...messages, userMessage];

    setMessages((prev) => [...prev, userMessage]);

    const question = input;

    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter(msg =>
          !msg.isError &&
          msg.sender &&
          msg.text &&
          msg.text !== "Tôi không thể giải đáp cho câu hỏi trên."
        )
        .slice(-4)
        .map((msg) => ({
          role:
            msg.sender === "user"
              ? "user"
              : "assistant",
          content: msg.text,
        }));
      const res = await getAnswerFromAI(
        {
          message: question,
          history
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            res.text ||
            "Xin lỗi, tôi chưa thể trả lời.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Đã xảy ra lỗi khi kết nối với AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="">
        <FloatButton
          icon={<MessageOutlined style={{ fontSize: 40 }} />}
          type="primary"
          onClick={() => setOpen(true)}
          style={{
            width: 65,
            height: 65,
            right: 30,
            bottom: 30,
          }}
        />
      </div>
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              icon={<RobotOutlined />}
            />
            <div>
              <div className="font-semibold">
                Trợ lý học tập DSA
              </div>
              <div className="text-xs text-gray-500">
                AI Learning Assistant
              </div>
            </div>
          </div>
        }
        placement="right"
        width={450}
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="flex flex-col h-[calc(100vh-180px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-4 ${msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${msg.sender === "user"
                    ? "flex-row-reverse"
                    : ""
                    }`}
                >
                  <Avatar
                    icon={
                      msg.sender === "user" ? (
                        <UserOutlined />
                      ) : (
                        <RobotOutlined />
                      )
                    }
                  />

                  <div
                    className={`px-4 py-2 rounded-xl ${msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                      }`}
                  >
                    <Text
                      style={{
                        color:
                          msg.sender === "user"
                            ? "white"
                            : "black",
                      }}
                    >
                      {msg.text}
                    </Text>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center">
                <Avatar icon={<RobotOutlined />} />
                <div className="bg-gray-100 px-4 py-2 rounded-xl">
                  <Spin size="small" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="flex gap-2 my-3 flex-wrap">
            <Button
              size="small"
              onClick={() =>
                setInput("Giải thích Stack là gì?")
              }
            >
              Stack
            </Button>

            <Button
              size="small"
              onClick={() =>
                setInput("Giải thích Queue là gì?")
              }
            >
              Queue
            </Button>

            <Button
              size="small"
              onClick={() =>
                setInput("Độ phức tạp của Quick Sort?")
              }
            >
              Quick Sort
            </Button>
          </div>

          {/* Input */}
          <div className="border-t pt-3">
            <TextArea
              rows={3}
              value={input}
              placeholder="Nhập câu hỏi..."
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <Button
              type="primary"
              block
              className="mt-2"
              onClick={handleSend}
              loading={loading}
            >
              Gửi câu hỏi
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Chatbox;