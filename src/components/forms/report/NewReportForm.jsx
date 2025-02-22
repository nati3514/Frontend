import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Upload, message, Card, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Select from 'react-select';
import axios from 'axios';
import { BACKENDURL } from '../../../helper/Urls';

const { TextArea } = Input;

const magnitudeOptions = [
    { value: 'HIGH', label: 'High Priority' },
    { value: 'MEDIUM', label: 'Medium Priority' },
    { value: 'LOW', label: 'Low Priority' }
];

const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_REVIEW', label: 'In Review' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' }
];

const NewReportForm = ({ reload, openModalFun }) => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

   
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${BACKENDURL}/employee`);
            const formattedEmployees = response.data.map(emp => ({
                value: emp.id,
                label: `${emp.fullName} (${emp.IDNO})`
            }));
            setEmployees(formattedEmployees);
        } catch (error) {
            message.error('Failed to fetch employees');
            console.error(error);
        }
    };

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            
           
            formData.append('description', values.description);
            formData.append('date', values.date.toISOString());
            formData.append('magnitude', values.magnitude.value);
            formData.append('location', values.location);
            formData.append('employeeId', selectedEmployee.value);
            formData.append('status', values.status.value);
    
            
            if (fileList.length > 0) {
                const file = fileList[0].originFileObj || fileList[0];
                formData.append('attachment', file);
            }
    
            const response = await axios.post(`${BACKENDURL}/reports/daily`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            message.success('Report submitted successfully!');
            reload();
            openModalFun(false);
        } catch (error) {
            message.error('Failed to submit report');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Card 
            title="New Daily Report" 
            className="shadow-lg rounded-lg"
            headStyle={{ 
                backgroundColor: '#1890ff', 
                color: 'white',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
            }}
        >
            <Form
                onFinish={handleFinish}
                layout="vertical"
                className="p-4"
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Employee"
                            name="employee"
                            rules={[{ required: true, message: 'Please select an employee!' }]}
                        >
                            <Select
                                options={employees}
                                value={selectedEmployee}
                                onChange={setSelectedEmployee}
                                isSearchable
                                placeholder="Search and select employee..."
                                className="w-full"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '40px',
                                        borderRadius: '6px'
                                    })
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="date"
                            label="Report Date"
                            rules={[{ required: true, message: 'Please select a date!' }]}
                        >
                            <DatePicker className="w-full h-10 rounded-md" />
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please input location!' }]}
                        >
                            <Input 
                                placeholder="Enter location" 
                                className="h-10 rounded-md"
                            />
                        </Form.Item>

                        <Form.Item
                            name="magnitude"
                            label="Priority Level"
                            rules={[{ required: true, message: 'Please select priority level!' }]}
                        >
                            <Select
                                options={magnitudeOptions}
                                placeholder="Select priority level"
                                className="w-full"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '40px',
                                        borderRadius: '6px'
                                    })
                                }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select status!' }]}
                        >
                            <Select
                                options={statusOptions}
                                placeholder="Select status"
                                className="w-full"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '40px',
                                        borderRadius: '6px'
                                    })
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please provide a description!' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Enter detailed description..."
                                className="rounded-md"
                            />
                        </Form.Item>

                        <Form.Item label="Attachments">
                            <Upload
                                beforeUpload={(file) => {
                                    setFileList([file]);
                                    return false;
                                }}
                                onRemove={() => setFileList([])}
                                fileList={fileList}
                                maxCount={1}
                                className="w-full"
                            >
                                <Button 
                                    icon={<UploadOutlined />}
                                    className="w-full h-10 rounded-md"
                                >
                                    Upload File
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item className="text-right mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="h-10 px-8 rounded-md text-base font-medium"
                        style={{ 
                            background: '#1890ff',
                            borderColor: '#1890ff'
                        }}
                    >
                        Submit Report
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default NewReportForm;