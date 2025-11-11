'use client'

import { useState } from 'react';
 ;
import Link from 'next/link';
import { subMonths } from 'date-fns';
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Table,
  Space,
  Typography,
  Divider,
  Tag,
  Popconfirm,
  DatePicker,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  PercentageOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useTransactions from '@/hooks/useTransactions';
import { calculateTotals, getExpensesByCategory, getMonthlyData, formatCurrency, formatPercentage } from '../../../utils/calculations';
import { Transaction, IncomeCategory, ExpenseCategory } from '../../../types/finance';
import IncomeExpenseLineChart from './components/Charts/IncomeExpenseLineChart';
import ExpensePieChart from './components/Charts/ExpensePieChart';
import MonthlyBarChart from './components/Charts/MonthlyBarChart';
import SavingsDoughnutChart from './components/Charts/SavingsDoughnutChart';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const INCOME_CATEGORIES: IncomeCategory[] = ['salary', 'freelance', 'investment', 'other'];
const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'food-dining',
  'housing-rent',
  'utilities',
  'transportation',
  'entertainment',
  'healthcare',
  'shopping',
  'other',
];

export default function PersonalFinanceTracker() {
  const { transactions, addTransaction, deleteTransaction, clearAllTransactions } = useTransactions();
  const [incomeForm] = Form.useForm();
  const [expenseForm] = Form.useForm();

  // Use March 2022 for demo, or current month if user has added recent data
  const latestTransactionDate = transactions.length > 0
    ? new Date(Math.max(...transactions.map(t => new Date(t.date).getTime())))
    : new Date();

  const currentMonth = calculateTotals(transactions, latestTransactionDate);
  const previousMonth = calculateTotals(transactions, subMonths(latestTransactionDate, 1));
  const expensesByCategory = getExpensesByCategory(transactions, latestTransactionDate);
  const monthlyData = getMonthlyData(transactions, 6, latestTransactionDate);

  const handleIncomeSubmit = (values: any) => {
    addTransaction({
      type: 'income',
      category: values.category,
      amount: values.amount,
      description: values.description || '',
      date: values.date.format('YYYY-MM-DD'),
    });
    incomeForm.resetFields();
  };

  const handleExpenseSubmit = (values: any) => {
    addTransaction({
      type: 'expense',
      category: values.category,
      amount: values.amount,
      description: values.description || '',
      date: values.date.format('YYYY-MM-DD'),
    });
    expenseForm.resetFields();
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      defaultSortOrder: 'ascend' as const,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'income' ? 'green' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) =>
        category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string, record: Transaction) =>
        description || record.category.replace(/-/g, ' '),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: number, record: Transaction) => (
        <Text strong style={{ color: record.type === 'income' ? '#52c41a' : '#f5222d' }}>
          {record.type === 'income' ? '+' : '-'}
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: Transaction) => (
        <Popconfirm
          title="Delete this transaction?"
          onConfirm={() => deleteTransaction(record.id)}
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

      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Content style={{ padding: '24px' }}>
          <div style={{ maxWidth: 1600, margin: '0 auto' }}>
            <Space style={{ marginBottom: 16 }}>
              <Link href="/projects">
                <Button icon={<ArrowLeftOutlined />}>Back to Projects</Button>
              </Link>
              <a
                href="https://github.com/venkatajanapareddy/venkata.dev/tree/main/src/app/projects/personal-finance-tracker"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button icon={<GithubOutlined />}>View Source</Button>
              </a>
            </Space>

            <Card style={{ marginBottom: 24 }}>
              <Title level={2} style={{ marginBottom: 8 }}>Transaction Analytics Dashboard</Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Multi-chart dashboard for transaction analytics with category-based aggregation and monthly trend analysis
              </Text>
              <div style={{ marginTop: 16 }}>
                <Space size={[8, 8]} wrap>
                  <Tag>TypeScript</Tag>
                  <Tag>React</Tag>
                  <Tag>Chart.js</Tag>
                  <Tag>Ant Design</Tag>
                </Space>
              </div>
            </Card>

            <Row gutter={16}>
              {/* Left Column: Forms and Data */}
              <Col xs={24} lg={14}>
                {/* Stats Cards */}
                <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                  <Col span={12}>
                    <Card size="small" bodyStyle={{ padding: 12 }}>
                      <Statistic
                        title="Total Income"
                        value={currentMonth.income}
                        precision={2}
                        prefix="$"
                        valueStyle={{ color: '#3f8600', fontSize: 20 }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" bodyStyle={{ padding: 12 }}>
                      <Statistic
                        title="Total Expenses"
                        value={currentMonth.expenses}
                        precision={2}
                        prefix="$"
                        valueStyle={{ color: '#cf1322', fontSize: 20 }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" bodyStyle={{ padding: 12 }}>
                      <Statistic
                        title="Net Savings"
                        value={currentMonth.netSavings}
                        precision={2}
                        prefix="$"
                        valueStyle={{ color: '#1890ff', fontSize: 20 }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" bodyStyle={{ padding: 12 }}>
                      <Statistic
                        title="Savings Rate"
                        value={currentMonth.savingsRate * 100}
                        precision={1}
                        suffix="%"
                        valueStyle={{ color: '#1890ff', fontSize: 20 }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Forms */}
                <Card title="Add Income" size="small" style={{ marginBottom: 16 }}>
                  <Form
                    form={incomeForm}
                    layout="inline"
                    onFinish={handleIncomeSubmit}
                    initialValues={{ date: dayjs(), category: 'salary' }}
                    style={{ width: '100%' }}
                  >
                    <Form.Item name="category" rules={[{ required: true }]} style={{ width: '23%' }}>
                      <Select size="small" placeholder="Category">
                        {INCOME_CATEGORIES.map(cat => (
                          <Option key={cat} value={cat}>
                            {cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="amount" rules={[{ required: true }]} style={{ width: '20%' }}>
                      <InputNumber
                        size="small"
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        precision={2}
                        prefix="$"
                        placeholder="Amount"
                      />
                    </Form.Item>
                    <Form.Item name="date" rules={[{ required: true }]} style={{ width: '23%' }}>
                      <DatePicker size="small" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="description" style={{ width: '23%' }}>
                      <Input size="small" placeholder="Description" />
                    </Form.Item>
                    <Form.Item style={{ width: '10%' }}>
                      <Button type="primary" size="small" htmlType="submit" block style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                        Add
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

                <Card title="Add Expense" size="small" style={{ marginBottom: 16 }}>
                  <Form
                    form={expenseForm}
                    layout="inline"
                    onFinish={handleExpenseSubmit}
                    initialValues={{ date: dayjs(), category: 'food-dining' }}
                    style={{ width: '100%' }}
                  >
                    <Form.Item name="category" rules={[{ required: true }]} style={{ width: '23%' }}>
                      <Select size="small" placeholder="Category">
                        {EXPENSE_CATEGORIES.map(cat => (
                          <Option key={cat} value={cat}>
                            {cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="amount" rules={[{ required: true }]} style={{ width: '20%' }}>
                      <InputNumber
                        size="small"
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        precision={2}
                        prefix="$"
                        placeholder="Amount"
                      />
                    </Form.Item>
                    <Form.Item name="date" rules={[{ required: true }]} style={{ width: '23%' }}>
                      <DatePicker size="small" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="description" style={{ width: '23%' }}>
                      <Input size="small" placeholder="Description" />
                    </Form.Item>
                    <Form.Item style={{ width: '10%' }}>
                      <Button type="primary" danger size="small" htmlType="submit" block>
                        Add
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

                {/* Transaction Table */}
                <Card
                  title="Transaction History"
                  size="small"
                  extra={
                    transactions.length > 0 && (
                      <Popconfirm
                        title="Clear all?"
                        onConfirm={clearAllTransactions}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger size="small">Clear All</Button>
                      </Popconfirm>
                    )
                  }
                >
                  {transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Text type="secondary">No transactions yet</Text>
                    </div>
                  ) : (
                    <Table
                      columns={columns}
                      dataSource={transactions}
                      rowKey="id"
                      pagination={{ pageSize: 8, size: 'small' }}
                      size="small"
                    />
                  )}
                </Card>
              </Col>

              {/* Right Column: Charts */}
              <Col xs={24} lg={10}>
                {transactions.length > 0 ? (
                  <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    <Card title="Income vs Expenses" size="small">
                      <div style={{ height: 250 }}>
                        <IncomeExpenseLineChart monthlyData={monthlyData} />
                      </div>
                    </Card>
                    <Card title="Expense Distribution" size="small">
                      <div style={{ height: 250 }}>
                        <ExpensePieChart expensesByCategory={expensesByCategory} />
                      </div>
                    </Card>
                    <Card title="Monthly Comparison" size="small">
                      <div style={{ height: 250 }}>
                        <MonthlyBarChart currentMonth={currentMonth} previousMonth={previousMonth} />
                      </div>
                    </Card>
                    <Card title="Savings vs Spending" size="small">
                      <div style={{ height: 250 }}>
                        <SavingsDoughnutChart income={currentMonth.income} expenses={currentMonth.expenses} />
                      </div>
                    </Card>
                  </Space>
                ) : (
                  <Card size="small">
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Text type="secondary">Add transactions to see charts</Text>
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
