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
  SendOutlined
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
    <FloatButton
      icon={<MessageOutlined style={{ fontSize: 28 }} />}
      type="primary"
      onClick={() => setOpen(true)}
      style={{
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        boxShadow: "0 8px 25px rgba(37,99,235,.35)"
      }}
    />


    <Drawer
      placement="right"
      width={430}
      open={open}
      onClose={() => setOpen(false)}
      closable={false}
      styles={{
        body: {
          padding: 0
        }
      }}

      title={
        <div className="
          flex 
          items-center 
          gap-3 
          -mx-2
        ">
          <div className="
            w-11 h-11
            rounded-full
            bg-gradient-to-br
            from-indigo-500
            to-blue-600
            flex
            items-center
            justify-center
            text-white
          ">
            <RobotOutlined className="text-xl"/>
          </div>


          <div>
            <div className="font-semibold text-base ">
              Trợ lý học tập
            </div>

            <div className=" text-xs  text-green-500 flex items-center gap-1 ">
              <span className="
                w-2 h-2 
                rounded-full
                bg-green-500
              " />
              AI đang hoạt động
            </div>

          </div>
        </div>
      }
    >
      <div className="
        flex
        flex-col
        h-[calc(100vh-130px)]
        bg-gray-50
      ">


        {/* MESSAGE AREA */}

        <div className="
          flex-1
          overflow-y-auto
          px-4
          py-5
          space-y-4
        ">


          {messages.map((msg,index)=>(
            <div
              key={index}
              className={`
                flex
                gap-2
                ${
                  msg.sender==="user"
                  ? "justify-end"
                  :"justify-start"
                }
              `}
            >


              {
                msg.sender !== "user" &&

                <div className="
                  w-8 h-8
                  rounded-full
                  bg-indigo-600
                  flex
                  items-center
                  justify-center
                  text-white
                  flex-shrink-0
                ">
                  <RobotOutlined/>
                </div>

              }



              <div
                className={`max-w-[78%] px-4 py-3 rounded-3xl text-[14px] leading-6 shadow-sm whitespace-pre-wrap
                  ${msg.sender==="user"
                    ?
                    `
                    bg-blue-600
                    text-white
                    rounded-br-md
                    `
                    :
                    `
                    bg-white
                    text-gray-700
                    rounded-bl-md
                    border
                    border-gray-100
                    `
                  }
                `}
              >

                {msg.text}

              </div>
              {msg.sender==="user" &&
                <div className=" w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 ">
                  <UserOutlined/>
                </div>
              }
            </div>
          ))}
          {loading &&  <div className=" flex gap-2 items-center ">
              <div className="
                w-8 h-8
                rounded-full
                bg-indigo-600
                flex
                items-center
                justify-center
                text-white
              ">
                <RobotOutlined/>
              </div>
              <div className="
                bg-white
                px-4
                py-3
                rounded-3xl
                border
              ">
                <Spin size="small"/>
              </div>
            </div>
          }
        </div>
        <div className="
          px-4
          pb-2
          flex
          gap-2
          overflow-x-auto
        ">
          {[
              "Stack là gì?",
              "Queue là gì?",
              "Quick Sort?"
            ].map((item)=>(

              <Button

                key={item}

                size="small"

                className="
                  rounded-full
                  bg-white
                  border-gray-200
                  hover:border-blue-500
                "

                onClick={()=>setInput(item)}

              >
                {item}

              </Button>

            ))
          }
        </div>

        {/* INPUT */}

        <div className="
          bg-white
          border-t
          px-4
          py-3
        ">
          <div className="
            flex
            gap-2
            items-end
          ">
            <TextArea
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Hỏi trợ lý học tập..."
              autoSize={{
                minRows:1,
                maxRows:4
              }}
              className="rounded-2xl"
              onPressEnter={(e)=>{
                if(!e.shiftKey){
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              type="primary"
              shape="circle"
              size="large"
              loading={loading}
              icon={<SendOutlined/>}
              onClick={handleSend}
            />
          </div>
         
        </div>


      </div>



    </Drawer>

  </>
);
};

export default Chatbox;