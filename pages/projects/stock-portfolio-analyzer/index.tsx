import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Popconfirm,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import usePortfolio from '../../../hooks/usePortfolio';
import {
  calculatePortfolioStats,
  calculateStockValue,
  calculateStockCost,
  calculateStockGain,
  calculateStockGainPercentage,
  formatCurrency,
  formatPercentage,
} from '../../../utils/stockCalculations';
import { Stock } from '../../../types/stock';
import PortfolioCompositionChart from './components/Charts/PortfolioCompositionChart';
import GainsLossesBarChart from './components/Charts/GainsLossesBarChart';
import SectorDiversificationChart from './components/Charts/SectorDiversificationChart';
import PerformanceLineChart from './components/Charts/PerformanceLineChart';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const SECTORS = ['Technology', 'Healthcare', 'Financial', 'Retail', 'Automotive', 'Energy', 'Utilities'];

export default function StockPortfolioAnalyzer() {
  const { stocks, addStock, deleteStock, clearAllStocks } = usePortfolio();
  const [form] = Form.useForm();
  const stats = calculatePortfolioStats(stocks);

  const handleSubmit = (values: any) => {
    addStock({
      symbol: values.symbol.toUpperCase(),
      companyName: values.companyName,
      shares: values.shares,
      purchasePrice: values.purchasePrice,
      purchaseDate: values.purchaseDate.format('YYYY-MM-DD'),
      currentPrice: values.currentPrice,
      sector: values.sector,
    });
    form.resetFields();
  };

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string) => <Text strong>{symbol}</Text>,
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
      align: 'right' as const,
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      align: 'right' as const,
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      align: 'right' as const,
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Total Value',
      key: 'value',
      align: 'right' as const,
      render: (_: any, record: Stock) => formatCurrency(calculateStockValue(record)),
    },
    {
      title: 'Gain/Loss',
      key: 'gain',
      align: 'right' as const,
      render: (_: any, record: Stock) => {
        const gain = calculateStockGain(record);
        const gainPct = calculateStockGainPercentage(record);
        return (
          <div>
            <Text strong style={{ color: gain >= 0 ? '#52c41a' : '#f5222d' }}>
              {formatCurrency(gain)}
            </Text>
            <br />
            <Text style={{ color: gain >= 0 ? '#52c41a' : '#f5222d', fontSize: 12 }}>
              {formatPercentage(gainPct)}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Sector',
      dataIndex: 'sector',
      key: 'sector',
      render: (sector: string) => <Tag>{sector}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: Stock) => (
        <Popconfirm
          title="Delete this stock?"
          onConfirm={() => deleteStock(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Stock Portfolio Analyzer with Recharts | Venkata Janapareddy</title>
        <meta name="description" content="Visualize stock performance, gains/losses, and portfolio diversity with interactive Recharts visualizations" />
      </Head>

      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Content style={{ padding: '24px' }}>
          <div style={{ maxWidth: 1600, margin: '0 auto' }}>
            <Space style={{ marginBottom: 16 }}>
              <Link href="/projects">
                <Button icon={<ArrowLeftOutlined />}>Back to Projects</Button>
              </Link>
              <a
                href="https://github.com/venkatajanapareddy/venkata.dev/tree/main/pages/projects/stock-portfolio-analyzer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button icon={<GithubOutlined />}>View Source</Button>
              </a>
            </Space>

            <Card style={{ marginBottom: 24 }}>
              <Title level={2} style={{ marginBottom: 8 }}>Stock Portfolio Analyzer with Recharts</Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Visualize stock performance, gains/losses, and portfolio diversity with interactive charts
              </Text>
              <div style={{ marginTop: 16 }}>
                <Space size={[8, 8]} wrap>
                  <Tag>TypeScript</Tag>
                  <Tag>React</Tag>
                  <Tag>Recharts</Tag>
                  <Tag>Ant Design</Tag>
                </Space>
              </div>
            </Card>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small">
                  <Statistic
                    title="Total Value"
                    value={stats.totalValue}
                    precision={2}
                    prefix="$"
                    valueStyle={{ fontSize: 20 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small">
                  <Statistic
                    title="Total Gain/Loss"
                    value={stats.totalGain}
                    precision={2}
                    prefix={stats.totalGain >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix={`(${formatPercentage(stats.totalGainPercentage)})`}
                    valueStyle={{ color: stats.totalGain >= 0 ? '#3f8600' : '#cf1322', fontSize: 20 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small">
                  <Statistic
                    title="Best Performer"
                    value={stats.bestPerformer ? stats.bestPerformer.symbol : 'N/A'}
                    valueStyle={{ fontSize: 20, color: '#3f8600' }}
                    suffix={stats.bestPerformer ? formatPercentage(calculateStockGainPercentage(stats.bestPerformer)) : ''}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small">
                  <Statistic
                    title="Worst Performer"
                    value={stats.worstPerformer ? stats.worstPerformer.symbol : 'N/A'}
                    valueStyle={{ fontSize: 20, color: '#cf1322' }}
                    suffix={stats.worstPerformer ? formatPercentage(calculateStockGainPercentage(stats.worstPerformer)) : ''}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* Left Column: Table and Form */}
              <Col xs={24} lg={14}>
                {/* Add Stock Form */}
                <Card title="Add Stock" size="small" style={{ marginBottom: 16 }}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                  >
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item name="symbol" label="Symbol" rules={[{ required: true }]}>
                          <Input placeholder="AAPL" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="companyName" label="Company" rules={[{ required: true }]}>
                          <Input placeholder="Apple Inc." />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={8}>
                        <Form.Item name="shares" label="Shares" rules={[{ required: true }]}>
                          <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="purchasePrice" label="Purchase Price" rules={[{ required: true }]}>
                          <InputNumber min={0} step={0.01} prefix="$" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="currentPrice" label="Current Price" rules={[{ required: true }]}>
                          <InputNumber min={0} step={0.01} prefix="$" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item name="purchaseDate" label="Purchase Date" rules={[{ required: true }]}>
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="sector" label="Sector" rules={[{ required: true }]}>
                          <Select placeholder="Select sector">
                            {SECTORS.map(sector => (
                              <Option key={sector} value={sector}>{sector}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" block>
                        Add Stock
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

                {/* Holdings Table */}
                <Card
                  title="Portfolio Holdings"
                  size="small"
                  extra={
                    stocks.length > 0 && (
                      <Popconfirm
                        title="Clear all stocks?"
                        onConfirm={clearAllStocks}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger size="small">Clear All</Button>
                      </Popconfirm>
                    )
                  }
                >
                  {stocks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Text type="secondary">No stocks in portfolio</Text>
                    </div>
                  ) : (
                    <Table
                      columns={columns}
                      dataSource={stocks}
                      rowKey="id"
                      pagination={{ pageSize: 10, size: 'small' }}
                      size="small"
                      scroll={{ x: true }}
                    />
                  )}
                </Card>
              </Col>

              {/* Right Column: Charts */}
              <Col xs={24} lg={10}>
                {stocks.length > 0 ? (
                  <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    <Card title="Portfolio Composition" size="small">
                      <div style={{ height: 300 }}>
                        <PortfolioCompositionChart stocks={stocks} />
                      </div>
                    </Card>
                    <Card title="Performance Over Time" size="small">
                      <div style={{ height: 300 }}>
                        <PerformanceLineChart stocks={stocks} />
                      </div>
                    </Card>
                    <Card title="Gains & Losses" size="small">
                      <div style={{ height: 300 }}>
                        <GainsLossesBarChart stocks={stocks} />
                      </div>
                    </Card>
                    <Card title="Sector Diversification" size="small">
                      <div style={{ height: 300 }}>
                        <SectorDiversificationChart stocks={stocks} />
                      </div>
                    </Card>
                  </Space>
                ) : (
                  <Card size="small">
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Text type="secondary">Add stocks to see charts</Text>
                    </div>
                  </Card>
                )}
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </>
  );
}
