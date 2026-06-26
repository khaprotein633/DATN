
import React from 'react'
import {Skeleton,Card,Row,Col} from "antd"

const ExamSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 mb-6 flex justify-between items-center">
        <Skeleton.Button active size="small" />
        <Skeleton.Input active style={{ width: 250 }} />
        <div className="flex gap-4">
          <Skeleton.Input active style={{ width: 80 }} />
          <Skeleton.Button active />
        </div>
      </div>

      {/* Main */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Question */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <div className="flex justify-between mb-6">
              <Skeleton.Input
                active
                size="small"
                style={{ width: 120 }}
              />

              <Skeleton.Button
                active
                size="small"
              />
            </div>

            {/* Question */}
            <Skeleton
              active
              paragraph={{
                rows: 2,
              }}
            />

            {/* Answers */}
            <div className="mt-8 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="border rounded-2xl p-4"
                >
                  <Skeleton
                    active
                    title={false}
                    paragraph={{
                      rows: 1,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              <Skeleton.Button active />
              <Skeleton.Button active />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border border-slate-200 rounded-3xl p-5">
            <Skeleton.Input
              active
              style={{ width: 150 }}
            />

            <div className="grid grid-cols-5 gap-2 mt-4 mb-6">
              {Array.from({ length: 20 }).map(
                (_, index) => (
                  <Skeleton.Button
                    key={index}
                    active
                    block
                  />
                )
              )}
            </div>

            <hr className="my-5" />

            <Skeleton
              active
              paragraph={{
                rows: 5,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamSkeleton
