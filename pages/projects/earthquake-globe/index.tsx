import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Typography,
  Tag,
  Select,
  Spin,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  AlertOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import {
  fetchEarthquakes,
  transformEarthquakeData,
  calculateEarthquakeStats,
  getMagnitudeLabel,
  formatEarthquakeTime,
  EarthquakePeriod,
  EarthquakeFeedType,
} from '../../../utils/earthquakeData';
import { EarthquakePoint } from '../../../types/earthquake';
import dynamic from 'next/dynamic';

const EarthquakeGlobe = dynamic(() => import('./components/EarthquakeGlobe'), {
  ssr: false,
  loading: () => <div style={{ width: 1320, height: 924, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>,
});

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function EarthquakeGlobeTracker() {
  const [earthquakes, setEarthquakes] = useState<EarthquakePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<EarthquakePeriod>('month');
  const [feedType, setFeedType] = useState<EarthquakeFeedType>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadEarthquakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEarthquakes(period, feedType);
      const points = transformEarthquakeData(data);
      setEarthquakes(points);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load earthquake data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarthquakes();
  }, [period, feedType]);

  const stats = calculateEarthquakeStats(earthquakes);

  return (
    <>
      <Head>
        <title>Global Earthquake Tracker 3D | Venkata Janapareddy</title>
        <meta name="description" content="Real-time 3D visualization of earthquakes around the world using WebGL and Three.js" />
        <style>{`
          .dark-select-dropdown .ant-select-item {
            background: #1a1f35 !important;
            color: #fff !important;
          }
          .dark-select-dropdown .ant-select-item-option-selected {
            background: #2a3f5f !important;
            color: #fff !important;
          }
          .dark-select-dropdown .ant-select-item-option-active {
            background: #2a3f5f !important;
          }
          .dark-select-dropdown {
            background: #1a1f35 !important;
          }
          .ant-select-selector {
            background: #2a3f5f !important;
            border: none !important;
            color: #fff !important;
          }
          .ant-select-arrow {
            color: #fff !important;
          }
        `}</style>
      </Head>

      <Layout style={{ minHeight: '100vh', background: '#0a0e1a' }}>
        <Content style={{ padding: '24px' }}>
          <div style={{ maxWidth: 1600, margin: '0 auto' }}>
            <Space style={{ marginBottom: 16 }}>
              <Link href="/projects">
                <Button icon={<ArrowLeftOutlined />} style={{ background: '#1a1f35', color: '#fff', border: 'none' }}>
                  Back to Projects
                </Button>
              </Link>
              <a
                href="https://github.com/venkatajanapareddy/venkata.dev/tree/main/pages/projects/earthquake-globe"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button icon={<GithubOutlined />} style={{ background: '#1a1f35', color: '#fff', border: 'none' }}>
                  View Source
                </Button>
              </a>
            </Space>

            <Card style={{ marginBottom: 24, background: '#1a1f35', border: 'none' }}>
              <Title level={2} style={{ marginBottom: 8, color: '#fff' }}>Global Earthquake Tracker 3D</Title>
              <Text style={{ fontSize: 16, color: '#aaa' }}>
                Real-time earthquake visualization powered by USGS data and WebGL
              </Text>
              <div style={{ marginTop: 16 }}>
                <Space size={[8, 8]} wrap>
                  <Tag color="blue">Three.js</Tag>
                  <Tag color="cyan">WebGL</Tag>
                  <Tag color="geekblue">TypeScript</Tag>
                  <Tag color="purple">React</Tag>
                  <Tag color="green">USGS API</Tag>
                </Space>
              </div>
            </Card>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={6}>
                <Card style={{ background: '#1a1f35', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: '#aaa' }}>Total Earthquakes</span>}
                    value={stats.total}
                    prefix={<GlobalOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ color: '#fff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={{ background: '#1a1f35', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: '#aaa' }}>Max Magnitude</span>}
                    value={stats.maxMagnitude.toFixed(1)}
                    prefix={<ThunderboltOutlined style={{ color: '#ff4d4f' }} />}
                    suffix={stats.maxMagnitude > 0 ? getMagnitudeLabel(stats.maxMagnitude) : ''}
                    valueStyle={{ color: '#fff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={{ background: '#1a1f35', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: '#aaa' }}>Average Magnitude</span>}
                    value={stats.avgMagnitude.toFixed(2)}
                    valueStyle={{ color: '#fff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={{ background: '#1a1f35', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: '#aaa' }}>Tsunami Warnings</span>}
                    value={stats.tsunamiCount}
                    prefix={<AlertOutlined style={{ color: '#faad14' }} />}
                    valueStyle={{ color: stats.tsunamiCount > 0 ? '#faad14' : '#fff' }}
                  />
                </Card>
              </Col>
            </Row>

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                closable
                onClose={() => setError(null)}
                style={{ marginBottom: 16 }}
              />
            )}

            {/* Main Globe */}
            <Card
              style={{ marginBottom: 16, background: '#1a1f35', border: 'none' }}
              title={<span style={{ color: '#fff' }}>3D Earthquake Globe</span>}
              extra={
                <Space>
                  <Select
                    value={feedType}
                    onChange={setFeedType}
                    style={{
                      width: 150,
                    }}
                    disabled={loading}
                    popupClassName="dark-select-dropdown"
                  >
                    <Option value="all">All Magnitudes</Option>
                    <Option value="m1">M1.0+</Option>
                    <Option value="m25">M2.5+</Option>
                    <Option value="m45">M4.5+</Option>
                    <Option value="significant">Significant</Option>
                  </Select>
                  <Select
                    value={period}
                    onChange={setPeriod}
                    style={{
                      width: 120,
                    }}
                    disabled={loading}
                    popupClassName="dark-select-dropdown"
                  >
                    <Option value="hour">Past Hour</Option>
                    <Option value="day">Past Day</Option>
                    <Option value="week">Past Week</Option>
                    <Option value="month">Past Month</Option>
                  </Select>
                  <Button
                    icon={<ReloadOutlined spin={loading} />}
                    onClick={loadEarthquakes}
                    disabled={loading}
                    style={{ background: '#2a3f5f', color: '#fff', border: 'none' }}
                  >
                    Refresh
                  </Button>
                </Space>
              }
            >
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 924 }}>
                {loading ? (
                  <Spin size="large" />
                ) : (
                  <EarthquakeGlobe earthquakes={earthquakes} width={1320} height={924} />
                )}
              </div>
              {lastUpdated && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Text style={{ color: '#999' }}>Last updated: {formatEarthquakeTime(lastUpdated.getTime())}</Text>
                </div>
              )}
            </Card>

            {/* Magnitude Distribution */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Card title={<span style={{ color: '#fff' }}>Magnitude Distribution</span>} style={{ background: '#1a1f35', border: 'none' }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <div style={{ width: 20, height: 20, background: '#ff0000', borderRadius: 2 }} />
                        <Text style={{ color: '#aaa' }}>Major (7.0+)</Text>
                      </Space>
                      <Text strong style={{ color: '#fff' }}>{stats.majorCount}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <div style={{ width: 20, height: 20, background: '#ff6600', borderRadius: 2 }} />
                        <Text style={{ color: '#aaa' }}>Strong (6.0 - 6.9)</Text>
                      </Space>
                      <Text strong style={{ color: '#fff' }}>{stats.strongCount}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <div style={{ width: 20, height: 20, background: '#ff9900', borderRadius: 2 }} />
                        <Text style={{ color: '#aaa' }}>Moderate (5.0 - 5.9)</Text>
                      </Space>
                      <Text strong style={{ color: '#fff' }}>{stats.moderateCount}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <div style={{ width: 20, height: 20, background: '#ffcc00', borderRadius: 2 }} />
                        <Text style={{ color: '#aaa' }}>Light (4.0 - 4.9)</Text>
                      </Space>
                      <Text strong style={{ color: '#fff' }}>{stats.lightCount}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={<span style={{ color: '#fff' }}>About This Visualization</span>} style={{ background: '#1a1f35', border: 'none' }}>
                  <Space direction="vertical" size="middle">
                    <Text style={{ color: '#aaa' }}>
                      This interactive 3D globe visualizes real-time earthquake data from the USGS (United States Geological Survey).
                    </Text>
                    <Text style={{ color: '#aaa' }}>
                      <strong style={{ color: '#fff' }}>Height:</strong> Represents earthquake magnitude<br />
                      <strong style={{ color: '#fff' }}>Color:</strong> Indicates severity (red = major, yellow = moderate, green = minor)<br />
                      <strong style={{ color: '#fff' }}>Interaction:</strong> Hover over earthquakes for details, drag to rotate globe
                    </Text>
                    <Text style={{ color: '#aaa' }}>
                      Data is updated in real-time from USGS servers. The globe automatically rotates and responds to mouse movement.
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </>
  );
}
