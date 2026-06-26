import React from 'react'
import {Skeleton,Card,Row,Col} from "antd"

const AssessmentSkeleton = () => {
    return (
        <div className="p-6">
            <div className="flex justify-between mb-6">
                <Skeleton.Input
                    active
                    size="large"
                    style={{ width: 250 }}
                />

                <Skeleton.Input
                    active
                    style={{ width: 200 }}
                />
            </div>

            <Row gutter={[16, 16]}>
                {[1, 2, 3, 4].map((item) => (
                    <Col xs={24} md={6} key={item}>
                        <Card>
                            <Skeleton active />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="mt-6">
                <Skeleton active paragraph={{ rows: 3 }} />
            </Card>

            <Row gutter={[16, 16]} className="mt-6">
                <Col span={12}>
                    <Card>
                        <Skeleton active paragraph={{ rows: 2 }} />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card>
                        <Skeleton active paragraph={{ rows: 2 }} />
                    </Card>
                </Col>
            </Row>

            <Card className="mt-6">
                <Skeleton active paragraph={{ rows: 8 }} />
            </Card>

            <Row gutter={[16, 16]} className="mt-6">
                <Col span={8}>
                    <Card>
                        <Skeleton active />
                    </Card>
                </Col>

                <Col span={16}>
                    <Card>
                        <Skeleton active paragraph={{ rows: 4 }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AssessmentSkeleton
