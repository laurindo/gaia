import { Discord } from '@styled-icons/fa-brands/Discord';
import { FacebookSquare } from '@styled-icons/fa-brands/FacebookSquare';
import { Instagram } from '@styled-icons/fa-brands/Instagram';
import { Telegram } from '@styled-icons/fa-brands/Telegram';
import { Twitter } from '@styled-icons/fa-brands/Twitter';
import { Signal } from '@styled-icons/simple-icons/Signal';
import { Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import { URLs } from '../routes/urls';
import { CustomLink as Link, LayoutFooter } from './styles';
import { appName } from '~/config/config';

const { Title, Text } = Typography;
function Footer() {
  return (
    <LayoutFooter>
      <Row>
        <Col sm={{ span: 20, offset: 2 }}>
          <Row justify="space-between">
            <Col md={12} xs={24}>
              <Title level={3}>{appName}</Title>
              <Text>
                The world’s largest digital marketplace for crypto collectibles and non-fungible
                tokens (NFTs). Buy, sell, and discover exclusive digital assets.
              </Text>
            </Col>
            <Col md={4} xs={24}>
              <Row>
                <Title level={3}>Get in touch</Title>
              </Row>
              <Row>
                <Link href={URLs.home}>Home</Link>
              </Row>
              <Row>
                <Link href={URLs.create}>Create NFT</Link>
              </Row>
              <Row>
                <Link href={URLs.marketplace}>Marketplace</Link>
              </Row>
              <Row>
                <Link href="#">Login</Link>
              </Row>
            </Col>
            <Col md={4} xs={24}>
              <Row>
                <Title level={3}>About Us</Title>
              </Row>
              <Row>
                <Link href="#">Global Value</Link>
              </Row>
              <Row>
                <Link href="#">Social</Link>
              </Row>
              <Row>
                <Link href="#">History</Link>
              </Row>
              <Row>
                <Link href="#">Press</Link>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row justify="space-between">
            <Row gutter={10} align="middle">
              <Col>
                <Link href="#">Privacy Policy</Link>
              </Col>
              <Divider type="vertical" />
              <Col>
                <Link href="#">Modern Day Statement</Link>
              </Col>
              <Divider type="vertical" />
              <Col>
                <Link href="#">Social Impact Statement</Link>
              </Col>
            </Row>
            <Row gutter={25}>
              <Col>
                <Link href="#" target="_blank">
                  <Discord size={25} />
                </Link>
              </Col>
              <Col>
                <Link href="#" target="_blank">
                  <FacebookSquare size={25} />
                </Link>
              </Col>
              <Col>
                <Link href="#" target="_blank">
                  <Telegram size={25} />
                </Link>
              </Col>
              <Col>
                <Link href="#" target="_blank">
                  <Twitter size={25} />
                </Link>
              </Col>
              <Col>
                <Link href="#" target="_blank">
                  <Signal size={25} />
                </Link>
              </Col>
              <Col>
                <Link href="#" target="_blank">
                  <Instagram size={25} />
                </Link>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </LayoutFooter>
  );
}

export default Footer;
