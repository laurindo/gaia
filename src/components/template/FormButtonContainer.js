import { Col, Form, Button } from 'antd';

function FormButtonContainer({ loading, buttonText }) {
  return (
    <Col span={24}>
      <Form.Item>
        <Button type="primary" block shape="round" htmlType="submit" size="large" loading={loading}>
          {buttonText}
        </Button>
      </Form.Item>
    </Col>
  );
}

export default FormButtonContainer;
