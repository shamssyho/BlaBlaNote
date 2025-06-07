import { Card, Tag } from 'antd';
import { Actions } from './actions';

export const NoteCard = () => {
  return (
    <div>
      <Card style={{ width: 450 }}>
        <p className="text-lg leading-7 font-bold">
          Meeting Notes - Q4 Planning
        </p>
        <Tag
          bordered={false}
          className="bg-gray-100 text-sm px-3 mt-3 mb-3 rounded-full font-medium text-gray-800"
        >
          test
        </Tag>
        <p className="text-gray-600 text-base mb-4">
          Discussed quarterly goals, budget allocation, and team restructuring.
          Key decisions made on marketing strategy.
        </p>

        <Actions />
      </Card>
    </div>
  );
};
