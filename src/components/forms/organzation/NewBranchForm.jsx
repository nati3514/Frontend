import {Button, Form, Input, Select} from 'antd';
import axios from 'axios';
import React, {useContext, useState} from 'react';
import { AlertContext } from '../../../context/AlertContext';
import { BACKENDURL } from '../../../helper/Urls';

const NewBranchForm = ({openModalFun,reload}) => {
  const {openNotification} = useContext (AlertContext);
  const [loading, setLoading] = useState (false);
  const [form] = Form.useForm();

  const onFinish = async values => {
    setLoading (true);
    try {
      const res = await axios.post (`${BACKENDURL}/organzation/branch/new`,{
        name: values.name,
        city: values.city,
        subCity: values.subCity,
        wereda: values.wereda,
      });
      reload()
      setLoading (false);
      openModalFun(false)
      openNotification ('success', res.data.message, 3, 'green');
      form.resetFields()
    } catch (error) {
      setLoading (false);
      openNotification ('error', error.response.data.message, 3, 'red');
    }
  };
  const onFinishFailed = errorInfo => {
    console.log ('Failed:', errorInfo);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        style={{margin: '5px'}}
        label="Office Name"
        rules={[
          {
            required: true,
            message: 'Please input Office',
          },
        ]}
        name="name"
      >
        <Input />
      </Form.Item>

      <div style={{display: 'flex', justifyContent: 'space-between',flexWrap:'wrap'}}>

      <Form.Item
          style={{margin: '5px', width: '47%'}}
          label="City / Region"
          name="city"
          rules={[
            {
              required: true,
              message: 'Please input City',
            },
          ]}
        >
          <Select
            placeholder="Search to Select"
            options={[
              {
                value: 'Addis Abeba',
                label: 'Addis Abeba',
              },
              {
                value: 'Sidama',
                label: 'Sidama',
              },
            ]}
          />
        </Form.Item>
        
        <Form.Item
          style={{margin: '5px', width: '47%'}}
          label="Sub City / Zone"
          rules={[
            {
              required: true,
              message: 'Please input Sub City',
            },
          ]}
          name="subCity"
        >
          <Select
            showSearch
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
              {
                value: 'Arada',
                label: 'Arada',
              },
              {
                value: 'Yeka',
                label: 'Yeka',
              },
              {
                value: 'Bole',
                label: 'Bole',
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          style={{margin: '5px', width: '47%'}}
          label="Wereda"
          rules={[
            {
              required: true,
              message: 'Please input wereda',
            },
          ]}
          name="wereda"
        >
          <Select
            showSearch
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
              {
                value: '01',
                label: '01',
              },
              {
                value: '02',
                label: '02',
              },
              {
                value: '04',
                label: '04',
              },
            ]}
          />
        </Form.Item>

      </div>
      <Form.Item
        style={{display: 'flex', justifyContent: 'center', marginTop: '15px'}}
      >
        <Button
          type="primary"
          htmlType="submit"
          disabled={loading}
          loading={loading}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewBranchForm;
