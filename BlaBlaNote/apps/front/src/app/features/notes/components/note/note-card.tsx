import { Card, Tag } from 'antd';
import { Actions } from './actions';
import records from '../../../share/mockdata/records';
export const NoteCard = () => {
  return (
    <div>
      {records.map((record) => (
        <Card style={{ width: 450 }}>
          <p className="text-lg leading-7 font-bold">{record.title}</p>

          {record.tags
            ? record.tags.map((tag) => (
                <Tag
                  bordered={false}
                  className="bg-gray-100 text-sm px-3 mt-3 mb-3 rounded-full font-medium text-gray-800"
                >
                  {tag}
                </Tag>
              ))
            : null}
          <p className="text-gray-600 text-base mb-4">{record.content}</p>

          <Actions />
        </Card>
      ))}
    </div>
  );
};
