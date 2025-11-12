'use client'

import { useState } from 'react';
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
  Select,
  Segmented,
  theme,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  UndoOutlined,
  PercentageOutlined,
  DollarOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import useCrypto from '@/hooks/useCrypto';
import {
  calculatePortfolioStats,
  formatCurrency,
  formatPercentage,
  formatNumber,
} from '@/utils/cryptoCalculations';
import { Cryptocurrency } from '@/types/crypto';
import PriceLineChart from './components/Charts/PriceLineChart';
import MarketCapBarChart from './components/Charts/MarketCapBarChart';
import VolumeChart from './components/Charts/VolumeChart';
import PerformanceHeatmap from './components/Charts/PerformanceHeatmap';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function CryptoPriceTracker() {
  const { token } = theme.useToken();
  const { cryptos, refreshPrices, resetData } = useCrypto();
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>(['BTC', 'ETH']);
  const [viewMode, setViewMode] = useState<'percentage' | 'absolute'>('percentage');
  const stats = calculatePortfolioStats(cryptos);

  const columns = [
    {
      title: '#',
      key: 'rank',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: Cryptocurrency) => (
        <Space>
          <Text strong>{record.symbol}</Text>
          <Text type="secondary">{record.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      align: 'right' as const,
      render: (price: number) => formatCurrency(price, price < 1 ? 4 : 2),
    },
    {
      title: '24h Change',
      key: 'change',
      align: 'right' as const,
      render: (_: any, record: Cryptocurrency) => (
        <div>
          <Text style={{ color: record.priceChange24h >= 0 ? '#52c41a' : '#f5222d' }}>
            {formatPercentage(record.priceChangePercentage24h)}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatCurrency(record.priceChange24h, 2)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Market Cap',
      dataIndex: 'marketCap',
      key: 'marketCap',
      align: 'right' as const,
      render: (marketCap: number) => formatNumber(marketCap),
    },
    {
      title: '24h Volume',
      dataIndex: 'volume24h',
      key: 'volume24h',
      align: 'right' as const,
      render: (volume: number) => formatNumber(volume),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <Space style={{ marginBottom: 16 }}>
            <Link href="/projects">
              <Button icon={<ArrowLeftOutlined />}>Back to Projects</Button>
            </Link>
            <a
              href="https://github.com/venkatajanapareddy/venkata.dev/tree/main/src/app/projects/crypto-price-tracker"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button icon={<GithubOutlined />}>View Source</Button>
            </a>
          </Space>

          <Card style={{ marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>Crypto Price Tracker with D3.js</Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Real-time cryptocurrency price tracking with advanced D3.js visualizations and market analytics
            </Text>
            <div style={{ marginTop: 16 }}>
              <Space size={[8, 8]} wrap>
                <Tag>TypeScript</Tag>
                <Tag>React</Tag>
                <Tag>D3.js</Tag>
                <Tag>Ant Design 5</Tag>
              </Space>
            </div>
          </Card>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Market Cap"
                  value={stats.totalValue}
                  precision={0}
                  prefix="$"
                  suffix="B"
                  valueStyle={{ fontSize: 20 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="24h Change"
                  value={stats.totalChange24h}
                  precision={2}
                  prefix={stats.totalChange24h >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  suffix={`(${formatPercentage(stats.totalChangePercentage24h)})`}
                  valueStyle={{
                    color: stats.totalChange24h >= 0 ? '#3f8600' : '#cf1322',
                    fontSize: 20
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Best Performer"
                  value={stats.bestPerformer ? stats.bestPerformer.symbol : 'N/A'}
                  valueStyle={{ fontSize: 20, color: '#3f8600' }}
                  suffix={stats.bestPerformer ? formatPercentage(stats.bestPerformer.priceChangePercentage24h) : ''}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Worst Performer"
                  value={stats.worstPerformer ? stats.worstPerformer.symbol : 'N/A'}
                  valueStyle={{ fontSize: 20, color: '#cf1322' }}
                  suffix={stats.worstPerformer ? formatPercentage(stats.worstPerformer.priceChangePercentage24h) : ''}
                />
              </Card>
            </Col>
          </Row>

          {/* Performance Heatmap */}
          <Card style={{ marginBottom: 16 }}>
            <PerformanceHeatmap cryptos={cryptos} colors={token} />
          </Card>

          <Row gutter={16}>
            {/* Left Column: Charts */}
            <Col xs={24} lg={14}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {/* Price Trends */}
                <Card
                  title="Price Trends"
                  extra={
                    <Space>
                      <Segmented
                        value={viewMode}
                        onChange={(value) => setViewMode(value as 'percentage' | 'absolute')}
                        options={[
                          {
                            label: 'Percentage',
                            value: 'percentage',
                            icon: <PercentageOutlined />,
                          },
                          {
                            label: 'Price',
                            value: 'absolute',
                            icon: <DollarOutlined />,
                          },
                        ]}
                      />
                      <Select
                        mode="multiple"
                        style={{ width: 200 }}
                        placeholder="Select cryptos"
                        value={selectedCryptos}
                        onChange={setSelectedCryptos}
                        maxTagCount={2}
                      >
                        {cryptos.map(crypto => (
                          <Option key={crypto.symbol} value={crypto.symbol}>
                            {crypto.symbol}
                          </Option>
                        ))}
                      </Select>
                    </Space>
                  }
                >
                  <div style={{ overflowX: 'auto' }}>
                    <PriceLineChart cryptos={cryptos} selectedSymbols={selectedCryptos} colors={token} viewMode={viewMode} />
                  </div>
                </Card>

                {/* Market Cap & Volume */}
                <Row gutter={16}>
                  <Col xs={24} xl={12}>
                    <Card title="Market Cap">
                      <div style={{ overflowX: 'auto' }}>
                        <MarketCapBarChart cryptos={cryptos} colors={token} />
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} xl={12}>
                    <Card title="24h Volume">
                      <div style={{ overflowX: 'auto' }}>
                        <VolumeChart cryptos={cryptos} colors={token} />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Space>
            </Col>

            {/* Right Column: Table */}
            <Col xs={24} lg={10}>
              <Card
                title="Cryptocurrency Prices"
                extra={
                  <Space>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={refreshPrices}
                      size="small"
                    >
                      Refresh
                    </Button>
                    <Button
                      icon={<UndoOutlined />}
                      onClick={resetData}
                      size="small"
                    >
                      Reset
                    </Button>
                  </Space>
                }
              >
                {cryptos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">No data available</Text>
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={cryptos}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
