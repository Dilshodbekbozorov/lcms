import { Card, Tag } from 'antd';
import PageHeader from '../../components/ui/PageHeader';
import { useGetScheduleQuery } from '../../features/api/apiSlice';
import { languageColors } from '../../utils/formatters';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayLabels = {
  Monday: 'Dush',
  Tuesday: 'Sesh',
  Wednesday: 'Chor',
  Thursday: 'Pay',
  Friday: 'Jum',
  Saturday: 'Shan',
};

const SchedulePage = () => {
  const { data, isLoading } = useGetScheduleQuery();

  const scheduleGrid = {};
  days.forEach((day) => {
    scheduleGrid[day] = [];
  });

  data?.data?.forEach((group) => {
    group.schedule?.forEach((slot) => {
      if (scheduleGrid[slot.day]) {
        scheduleGrid[slot.day].push({
          ...slot,
          groupName: group.name,
          language: group.language,
          teacher: group.teacher
            ? `${group.teacher.firstName} ${group.teacher.lastName}`
            : '',
        });
      }
    });
  });

  Object.keys(scheduleGrid).forEach((day) => {
    scheduleGrid[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <PageHeader title="Dars jadvali" subtitle="Haftalik darslar jadvali" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {days.map((day) => (
          <Card
            key={day}
            title={dayLabels[day]}
            size="small"
            loading={isLoading}
            headStyle={{ textAlign: 'center', background: '#fafafa' }}
          >
            {scheduleGrid[day].length > 0 ? (
              scheduleGrid[day].map((slot, i) => (
                <div
                  key={i}
                  style={{
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 6,
                    borderLeft: `4px solid ${languageColors[slot.language] || '#1677ff'}`,
                    background: '#f9f9f9',
                  }}
                >
                  <strong style={{ fontSize: 13 }}>{slot.groupName}</strong>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {slot.room && `Xona: ${slot.room}`}
                  </div>
                  <div style={{ fontSize: 11, color: '#999' }}>{slot.teacher}</div>
                  <Tag
                    color={languageColors[slot.language]}
                    style={{ marginTop: 4, fontSize: 10 }}
                  >
                    {slot.language}
                  </Tag>
                </div>
              ))
            ) : (
              <p style={{ color: '#ccc', textAlign: 'center', fontSize: 12 }}>-</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
