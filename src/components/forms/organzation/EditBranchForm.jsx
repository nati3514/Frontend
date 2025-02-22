import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AlertContext } from '../../../context/AlertContext';
import { BACKENDURL } from '../../../helper/Urls';

const EditBranchForm = ({ openModalFun, reload, id }) => {
    const { openNotification } = useContext(AlertContext);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchBranchData();
    }, [id]);

    const fetchBranchData = async () => {
        try {
            const response = await axios.get(`${BACKENDURL}/organzation/branch/${id}`);
            
            form.setFieldsValue({
                name: response.data.name,
                city: response.data.city,
                subCity: response.data.subCity,
                wereda: response.data.wereda,
                status: response.data.status
            });
        } catch (error) {
            openNotification('error', 'Failed to fetch branch data', 3, 'red');
        }
    };
    
    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.patch(`${BACKENDURL}/organzation/branch/${id}`, values);
            openNotification('success', 'Branch updated successfully', 3, 'green');
            reload();
            openModalFun(false);
        } catch (error) {
            openNotification('error', error.response?.data?.message || 'Update failed', 3, 'red');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                name="name"
                label="Branch Name"
                rules={[{ required: true, message: 'Please enter branch name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="subCity"
                label="Sub City / Zone"
                rules={[{ required: true, message: 'Please enter sub city' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="wereda"
                label="Wereda"
                rules={[{ required: true, message: 'Please enter wereda' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
            >
                <Select>
                    <Select.Option value="Active">Active</Select.Option>
                    <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ width: '100%' }}
                >
                    Update Branch
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditBranchForm;
