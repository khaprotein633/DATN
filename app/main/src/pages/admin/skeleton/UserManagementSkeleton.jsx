import React from "react";
import {
  Card,
  Skeleton,
  Space,
} from "antd";

const UserManagementSkeleton = () => {
  return (
    <Card>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <Skeleton.Input
          active
          style={{
            width: 200,
            height: 32,
          }}
        />

        <Skeleton.Input
          active
          style={{
            width: 300,
            height: 40,
          }}
        />
      </div>

      {/* Table Header */}
      <div className="border-b pb-3 mb-3 flex">
        <Skeleton.Input active style={{ width: 250 }} />
        <Skeleton.Input active style={{ width: 200, marginLeft: 20 }} />
        <Skeleton.Input active style={{ width: 120, marginLeft: 20 }} />
        <Skeleton.Input active style={{ width: 150, marginLeft: 20 }} />
      </div>

      {/* Table Rows */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center py-4 border-b"
        >
          <Skeleton.Avatar
            active
            size="large"
          />

          <div className="ml-4 flex-1">
            <Skeleton
              active
              title={{
                width: "30%",
              }}
              paragraph={{
                rows: 1,
                width: ["50%"],
              }}
            />
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="mt-5 flex justify-end">
        <Space>
          <Skeleton.Button active />
          <Skeleton.Button active />
          <Skeleton.Button active />
          <Skeleton.Button active />
        </Space>
      </div>
    </Card>
  );
};

export default UserManagementSkeleton;