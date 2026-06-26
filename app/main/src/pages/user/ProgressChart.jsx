import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Card, Empty } from "antd";
import dayjs from "dayjs";

const ProgressChart = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <Card title="Tiến độ học tập">
        <Empty description="Chưa có dữ liệu" />
      </Card>
    );
  }

  return (
    <Card title="Tiến độ học tập theo thời gian">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              dayjs(value).format("DD/MM")
            }
          />

          <YAxis
            domain={[0, 10]}
          />

          <Tooltip
            labelFormatter={(value) =>
              dayjs(value).format(
                "DD/MM/YYYY HH:mm"
              )
            }
          />

          <Line
            type="monotone"
            dataKey="score"
            name="Điểm số"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProgressChart;