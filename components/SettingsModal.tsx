import React, { useEffect } from 'react';
import { Modal, Form, Select, Radio } from 'antd';
import { AppSettings } from '../types';
import { SunOutlined, MoonOutlined, LaptopOutlined } from './icons';
import CloseIcon from './CloseIcon';
import DownArrowIcon from './DownArrowIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

const themeOptions = [
    { label: <><SunOutlined /> Sáng</>, value: 'light' },
    { label: <><MoonOutlined /> Tối</>, value: 'dark' },
    { label: <><LaptopOutlined /> Hệ thống</>, value: 'system' },
];

const chatModeOptions = [
    { value: 'professional', label: 'Chuyên nghiệp' },
    { value: 'creative', label: 'Sáng tạo' },
    { value: 'technical', label: 'Kỹ thuật' },
];

const responseModeOptions = [
    { value: 'standard', label: 'Tiêu chuẩn (Hỗ trợ Tool)' },
    { value: 'stream', label: 'Luồng (Nhanh)' },
];

const aiModelOptions = [
    { value: 'gemini-2.5-flash-preview-04-17', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-pro-vision', label: 'Gemini Pro Vision (demo)' },
];


const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue(currentSettings);
    }
  }, [isOpen, currentSettings, form]);

  const handleSave = () => {
    form.validateFields().then(values => {
      onSave(values as AppSettings);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <Modal
      title="Cài đặt"
      open={isOpen}
      onOk={handleSave}
      onCancel={onClose}
      okText="Lưu & Đóng"
      cancelText="Hủy"
      closeIcon={<CloseIcon />}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={currentSettings}
      >
        <Form.Item name="theme" label="Giao diện">
            <Radio.Group options={themeOptions} optionType="button" buttonStyle="solid" />
        </Form.Item>
        <Form.Item name="responseMode" label="Chế độ Phản hồi">
            <Select options={responseModeOptions} suffixIcon={<DownArrowIcon />} />
        </Form.Item>
         <Form.Item name="chatMode" label="Phong cách Chat của AI">
            <Select options={chatModeOptions} suffixIcon={<DownArrowIcon />} />
        </Form.Item>
         <Form.Item name="aiModel" label="Model AI">
            <Select options={aiModelOptions} suffixIcon={<DownArrowIcon />} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SettingsModal;