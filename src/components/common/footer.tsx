import { Typography } from "antd";

const { Text, Paragraph } = Typography;

export const Footer = () => (
  <footer>
    <Paragraph style={{ textAlign: "center" }}>
      <Text type="secondary">&copy; 2024 NijiX</Text>
    </Paragraph>
  </footer>
);
