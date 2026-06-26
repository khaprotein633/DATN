import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
  Avatar,
  Space,
} from "antd";

import {
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";


import { getStatistic } from "../../services/statisticService"

const { Title, Text } = Typography;

const Dashboard = () => {

  //const [recentUsers,setRecentUsers] = useState([]);
  const [statData, setStatData] = useState([]);

  useEffect(() => {
    fetchAllStatistic();
  }, []);

  const fetchAllStatistic = async () => {
    try {
      const data = await getStatistic();
      console.log("data:", data);
      //setSubjects(data.list || []);
      setStatData(data);
      console.log("data:", statData);
      set
    } catch (err) {
      console.log(err);
    }
  };

  const recentUsers = [
    {
      key: 1,
      name: "Nguyễn Văn A",
      email: "a@gmail.com",
    },
    {
      key: 2,
      name: "Trần Văn B",
      email: "b@gmail.com",
    },
  ];

  const statCards = [
    {
      title: "Người dùng",
      value: statData.totalUsers,
      icon: <UserOutlined />,
      color: "#1677ff",
    },
    {
      title: "Môn học",
      value: statData.totalSubjects,
      icon: <BookOutlined />,
      color: "#52c41a",
    },
    {
      title: "Câu hỏi",
      value: statData.totalQuestions,
      icon: <QuestionCircleOutlined />,
      color: "#faad14",
    },
    {
      title: "Đề thi",
      value: statData.totalExams,
      icon: <FileTextOutlined />,
      color: "#722ed1",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Tổng quan hệ thống trắc nghiệm và đánh giá người học
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={[20, 20]}>
        {statCards.map((item) => (
          <Col xs={24} sm={12} xl={6} key={item.title}>
            <Card
              hoverable
              className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold m-0">
                    {item.value}
                  </h2>
                </div>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Attempts */}
      <Row className="mt-5">
        <Col span={24}>
          <Card className="rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 mb-1">
                  Tổng lượt thi
                </p>

                <h1 className="text-4xl font-bold">
                  {statData.totalResults}
                </h1>
              </div>

              <div className="text-5xl">
                📊
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Users */}
      <Row className="mt-5">
        <Col span={24}>
          <Card
            className="rounded-2xl shadow-sm"
            title={
              <span className="text-lg font-semibold">
                Người dùng mới
              </span>
            }
          >
            <Table
              rowKey="_id"
              pagination={false}
              dataSource={statData.recentUsers}
              columns={[
                {
                  title: "Người dùng",
                  render: (_, record) => (
                    <div className="flex items-center gap-3">
                      <Avatar
                        size={40}
                        icon={<UserOutlined />}
                      />
                      <div>
                        <div className="font-medium">
                          {record.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {record.email}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Ngày đăng ký",
                  dataIndex: "createdAt",
                  render: (date) =>
                    new Date(date).toLocaleString("vi-VN"),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;