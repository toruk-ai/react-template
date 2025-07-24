import React from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, Checkbox } from 'antd';
import { Formik, type FormikProps, type FormikValues } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[]; // for select
  validation?: Yup.AnySchema;
  colSpan?: number; // 栅格占位
  disabled?: boolean;
  hidden?: boolean;
}

interface FormikFormProps {
  fields: FormField[];
  initialValues: FormikValues;
  validationSchema?: Yup.ObjectSchema<any>;
  onSubmit: (values: FormikValues) => void | Promise<void>;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span: number };
  wrapperCol?: { span: number };
}

const FormikForm: React.FC<FormikFormProps> = ({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  loading = false,
  submitText,
  cancelText,
  onCancel,
  layout = 'vertical',
  labelCol = { span: 6 },
  wrapperCol = { span: 18 },
}) => {
  const { t } = useTranslation();

  // 渲染表单项
  const renderFormItem = (field: FormField, formik: FormikProps<FormikValues>) => {
    const { name, label, type, placeholder, options, disabled, hidden } = field;
    const error = formik.touched[name] && formik.errors[name];
    const value = formik.values[name];

    if (hidden) return null;

    const commonProps = {
      placeholder: placeholder || `${t('common.enter')}${label}`,
      disabled,
      value,
      onChange: (e: any) => {
        const val = e?.target ? e.target.value : e;
        formik.setFieldValue(name, val);
      },
      onBlur: () => formik.setFieldTouched(name, true),
    };

    let inputElement: React.ReactNode;

    switch (type) {
      case 'textarea':
        inputElement = <TextArea rows={4} {...commonProps} />;
        break;
      case 'number':
        inputElement = (
          <InputNumber
            style={{ width: '100%' }}
            {...commonProps}
            onChange={(val) => formik.setFieldValue(name, val)}
          />
        );
        break;
      case 'select':
        inputElement = (
          <Select {...commonProps} onChange={(val) => formik.setFieldValue(name, val)}>
            {options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
        break;
      case 'date':
        inputElement = (
          <DatePicker
            style={{ width: '100%' }}
            {...commonProps}
            onChange={(date) => formik.setFieldValue(name, date)}
          />
        );
        break;
      case 'checkbox':
        inputElement = (
          <Checkbox
            checked={value}
            onChange={(e) => formik.setFieldValue(name, e.target.checked)}
            disabled={disabled}
          >
            {label}
          </Checkbox>
        );
        break;
      case 'password':
        inputElement = <Input.Password {...commonProps} />;
        break;
      default:
        inputElement = <Input {...commonProps} />;
    }

    if (type === 'checkbox') {
      return (
        <Form.Item
          key={name}
          validateStatus={error ? 'error' : ''}
          help={error as string}
        >
          {inputElement}
        </Form.Item>
      );
    }

    return (
      <Form.Item
        key={name}
        label={label}
        validateStatus={error ? 'error' : ''}
        help={error as string}
        required={field.required}
      >
        {inputElement}
      </Form.Item>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(formik) => (
        <Form
          layout={layout}
          labelCol={layout === 'horizontal' ? labelCol : undefined}
          wrapperCol={layout === 'horizontal' ? wrapperCol : undefined}
          onFinish={formik.handleSubmit}
        >
          {fields.map((field) => renderFormItem(field, formik))}
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginRight: 8 }}
            >
              {submitText || t('common.submit')}
            </Button>
            {onCancel && (
              <Button onClick={onCancel}>
                {cancelText || t('common.cancel')}
              </Button>
            )}
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
};

export default FormikForm;