import { Button, Form, Input, Select, Card, Row, Col, DatePicker } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AlertContext } from '../../../context/AlertContext';
import { BACKENDURL } from '../../../helper/Urls';
import moment from 'moment';

const EditPositionForm = ({ openModalFun, reload, id }) => {
    const { openNotification } = useContext(AlertContext);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [branchOptions, setBranchOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);

    useEffect(() => {
        fetchPositionData();
        fetchBranchOptions();
    }, [id]);

    const fetchBranchOptions = async () => {
        try {
            const response = await axios.get(`${BACKENDURL}/organzation/branch/all`);
            const options = response.data.branchs.map(branch => ({
                value: branch.id,
                label: branch.name
            }));
            setBranchOptions(options);
        } catch (error) {
            openNotification('error', 'Failed to fetch branch data', 3, 'red');
        }
    };

    const fetchDepartmentOptions = async (branchId) => {
        try {
            const response = await axios.get(`${BACKENDURL}/organzation/department/find?branchId=${branchId}`);
            const options = response.data.departments.map(dept => ({
                value: dept.id,
                label: dept.name
            }));
            setDepartmentOptions(options);
            form.setFieldValue('department', undefined);
        } catch (error) {
            openNotification('error', 'Failed to fetch department data', 3, 'red');
        }
    };

    const fetchPositionData = async () => {
        try {
            const response = await axios.get(`${BACKENDURL}/organzation/position/${id}`);
            const positionData = response.data;
            
            await fetchDepartmentOptions(positionData.department.branch.id);

            form.setFieldsValue({
                IDNO: positionData.IDNO,
                name: positionData.name,
                branch: positionData.department.branch.id,
                department: positionData.department.id,
                status: positionData.status,
                employees: positionData.EmployeeWorkDetail.length,
                createdAt: moment(positionData.createdAt)
            });
        } catch (error) {
            openNotification('error', 'Failed to fetch position data', 3, 'red');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = {
                IDNO: values.IDNO,
                name: values.name,
                branchId: values.branch,
                departmentId: values.department,
                status: values.status,
                employees: parseInt(values.employees),
                createdAt: values.createdAt,
                updatedAt: new Date()
            };
            
            await axios.patch(`${BACKENDURL}/organzation/position/${id}`, formData);
            openNotification('success', 'Position updated successfully', 3, 'green');
            reload();
            openModalFun(false);
        } catch (error) {
            openNotification('error', error.response?.data?.message || 'Update failed', 3, 'red');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="IDNO" label="Position ID">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Position Name"
                            rules={[{ required: true, message: 'Please enter position name' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="branch"
                            label="Office/Branch"
                            rules={[{ required: true, message: 'Please select office' }]}
                        >
                            <Select
                                options={branchOptions}
                                onChange={(value) => fetchDepartmentOptions(value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="department"
                            label="Department"
                            rules={[{ required: true, message: 'Please select department' }]}
                        >
                            <Select options={departmentOptions} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select status' }]}
                        >
                            <Select>
                                <Select.Option value="Active">Active</Select.Option>
                                <Select.Option value="InActive">InActive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="createdAt" label="Created Date">
                            <DatePicker
                                style={{ width: '100%' }}
                                disabled
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="employees"
                            label="Employees"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ width: '100%' }}
                    >
                        Update Position
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default EditPositionForm;
