import { Button, Form, Input, Select, Card, Row, Col, DatePicker } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AlertContext } from '../../../context/AlertContext';
import { BACKENDURL } from '../../../helper/Urls';
import moment from 'moment';

const EditDepartmentForm = ({ openModalFun, reload, id }) => {
    const { openNotification } = useContext(AlertContext);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [branchOptions, setBranchOptions] = useState([]);

    useEffect(() => {
        fetchDepartmentData();
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
    

    const fetchDepartmentData = async () => {
        try {
            const response = await axios.get(`${BACKENDURL}/organzation/department/${id}`);
            const branchId = response.data.branch.id;
            
            form.setFieldsValue({
                IDNO: response.data.IDNO,
                name: response.data.name,
                branch: branchId, 
                status: response.data.status,
                createdAt: moment(response.data.createdAt)
            });
        } catch (error) {
            openNotification('error', 'Failed to fetch department data', 3, 'red');
        }
    };
    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.patch(`${BACKENDURL}/organzation/department/${id}`, values);
            openNotification('success', 'Department updated successfully', 3, 'green');
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
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="IDNO"
                            label="Department ID"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Department Name"
                            rules={[{ required: true, message: 'Please enter department name' }]}
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
                                placeholder="Select Branch"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                </Row>

                <Row gutter={16}>
                                    
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
                        Update Department
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default EditDepartmentForm;
