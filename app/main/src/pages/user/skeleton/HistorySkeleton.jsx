import {
  Card,
  Row,
  Col,
  Skeleton,
} from "antd";

const HistorySkeleton = () => {
  return (
    <div className="p-6">
      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <Skeleton.Input
            active
            style={{
              width: 250,
              height: 36,
            }}
          />

          <div className="mt-3">
            <Skeleton.Input
              active
              style={{
                width: 400,
                height: 20,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton.Input
            active
            style={{
              width: 260,
              height: 40,
            }}
          />

          <Skeleton.Input
            active
            style={{
              width: 260,
              height: 40,
            }}
          />
        </div>
      </div>

      {/* OVERVIEW */}

      <Row gutter={[16, 16]}>
        {[1, 2, 3].map((item) => (
          <Col
            xs={24}
            md={8}
            key={item}
          >
            <Card>
              <Skeleton
                active
                paragraph={{
                  rows: 1,
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* EXAM CARDS */}

      <div className="mt-6 flex flex-col gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Card
            key={item}
            className="shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                {/* Tags */}

                <div className="flex gap-2 mb-3">
                  <Skeleton.Button
                    active
                    size="small"
                  />

                  <Skeleton.Button
                    active
                    size="small"
                  />
                </div>

                {/* Title */}

                <Skeleton.Input
                  active
                  style={{
                    width: "60%",
                  }}
                />

                {/* Stats */}

                <div className="flex flex-wrap gap-2 mt-4">
                  <Skeleton.Button
                    active
                    size="small"
                  />

                  <Skeleton.Button
                    active
                    size="small"
                  />

                  <Skeleton.Button
                    active
                    size="small"
                  />

                  <Skeleton.Button
                    active
                    size="small"
                  />
                </div>
              </div>

              {/* Actions */}

              <div className="flex gap-2">
                <Skeleton.Button
                  active
                  style={{
                    width: 120,
                  }}
                />

                <Skeleton.Button
                  active
                  style={{
                    width: 120,
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistorySkeleton;