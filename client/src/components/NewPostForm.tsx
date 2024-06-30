import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addPost } from '../redux/reducers/postSlice';
import { Modal, Input, Button, Form, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const NewPostForm: React.FC = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = (values: any) => {
    // Validate form data
    if (!values.title || !values.thumbnail || !values.category || !values.content) {
      setModalVisible(true);
    } else {
      dispatch(addPost(values));
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto my-4">
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item label="Tên bài viết" name="title" rules={[{ required: true, message: 'Tên bài viết không được phép để trống' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Hình ảnh" name="thumbnail" rules={[{ required: true, message: 'Đường dẫn hình ảnh không được phép để trống' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Thể loại" name="category" rules={[{ required: true, message: 'Thể loại không được phép để trống' }]}>
          <Select>
            <Option value="Lập trình web">Lập trình web</Option>
            <Option value="Lập trình mobile">Lập trình mobile</Option>
            {/* Add more categories as needed */}
          </Select>
        </Form.Item>
        <Form.Item label="Nội dung" name="content" rules={[{ required: true, message: 'Nội dung không được phép để trống' }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Xuất bản
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Cảnh báo"
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="ok" type="primary" onClick={() => setModalVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <p>Tên bài viết không được phép để trống</p>
      </Modal>
    </div>
  );
};

export default NewPostForm;
