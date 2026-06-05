import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Select, DatePicker, Table, Radio, Button, message, Space } from 'antd';
import dayjs from 'dayjs';
import PageHeader from '../../components/ui/PageHeader';
import {
  useGetGroupsQuery,
  useGetGroupQuery,
  useGetAttendanceQuery,
  useBulkAttendanceMutation,
} from '../../features/api/apiSlice';
import { formatDate, statusLabels } from '../../utils/formatters';

const AttendancePage = () => {
  const [searchParams] = useSearchParams();
  const [groupId, setGroupId] = useState(searchParams.get('group') || null);
  const [date, setDate] = useState(dayjs());
  const [records, setRecords] = useState({});

  const { data: groupsData } = useGetGroupsQuery();
  const { data: groupData } = useGetGroupQuery(groupId, { skip: !groupId });
  const { data: attendanceData, refetch } = useGetAttendanceQuery(
    { group: groupId, date: date.format('YYYY-MM-DD') },
    { skip: !groupId }
  );
  const [bulkAttendance, { isLoading }] = useBulkAttendanceMutation();

  useEffect(() => {
    if (attendanceData?.data) {
      const map = {};
      attendanceData.data.forEach((a) => {
        map[a.student._id || a.student] = a.status;
      });
      setRecords(map);
    }
  }, [attendanceData]);

  const handleStatusChange = (studentId, status) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!groupId) {
      message.warning('Guruhni tanlang');
      return;
    }

    const students = groupData?.data?.students || [];
    const payload = {
      groupId,
      date: date.format('YYYY-MM-DD'),
      records: students.map((s) => ({
        studentId: s._id,
        status: records[s._id] || 'present',
      })),
    };

    try {
      await bulkAttendance(payload).unwrap();
      message.success('Davomat saqlandi');
      refetch();
    } catch (err) {
      message.error(err.data?.message || 'Xatolik');
    }
  };

  const columns = [
    {
      title: 'O\'quvchi',
      render: (_, r) => `${r.firstName} ${r.lastName}`,
    },
    {
      title: 'Holat',
      render: (_, r) => (
        <Radio.Group
          value={records[r._id] || 'present'}
          onChange={(e) => handleStatusChange(r._id, e.target.value)}
          optionType="button"
          buttonStyle="solid"
          size="small"
        >
          {['present', 'absent', 'late', 'excused'].map((s) => (
            <Radio.Button key={s} value={s}>
              {statusLabels[s]}
            </Radio.Button>
          ))}
        </Radio.Group>
      ),
    },
  ];

  const historyColumns = [
    {
      title: 'O\'quvchi',
      render: (_, r) => `${r.student?.firstName} ${r.student?.lastName}`,
    },
    { title: 'Sana', dataIndex: 'date', render: formatDate },
    { title: 'Holat', dataIndex: 'status', render: (s) => statusLabels[s] },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader title="Davomat" subtitle="Guruh davomatini qayd etish" />

      <Card style={{ marginBottom: 24 }}>
        <Space wrap>
          <Select
            placeholder="Guruhni tanlang"
            style={{ width: 200 }}
            value={groupId}
            onChange={setGroupId}
            options={groupsData?.data?.map((g) => ({
              value: g._id,
              label: g.name,
            }))}
          />
          <DatePicker
            value={date}
            onChange={setDate}
            format="DD.MM.YYYY"
          />
          <Button type="primary" onClick={handleSubmit} loading={isLoading}>
            Saqlash
          </Button>
        </Space>
      </Card>

      {groupId && (
        <>
          <Card title={`Davomat - ${date.format('DD.MM.YYYY')}`} style={{ marginBottom: 24 }}>
            <Table
              columns={columns}
              dataSource={groupData?.data?.students || []}
              rowKey="_id"
              pagination={false}
            />
          </Card>

          <Card title="O'tgan davomatlar">
            <Table
              columns={historyColumns}
              dataSource={attendanceData?.data || []}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default AttendancePage;
