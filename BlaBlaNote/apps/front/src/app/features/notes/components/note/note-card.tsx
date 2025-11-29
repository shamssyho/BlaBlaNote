import { Card, Tag } from 'antd';
import { Actions } from './actions';
import records from '../../../share/mockdata/records';
import { useState } from 'react';
export const NoteCard = () => {
  const [notes, setNotes] = useState(records);
  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {notes.map((note) => (
        <Card key={note.id} style={{ width: 450 }}>
          <p className="text-lg leading-7 font-bold">{note.title}</p>

          {note.tags ? (
            note.tags.map((tag, index) => (
              <Tag
                key={tag + index}
                bordered={false}
                className="bg-gray-100 text-sm px-3 mt-3 mb-3 rounded-full font-medium text-gray-800"
              >
                {tag}
              </Tag>
            ))
          ) : (
            <div className="h-11">
              <br />
            </div>
          )}
          <p className="text-gray-600 text-base mb-4">{note.content}</p>

          <Actions id={note.id} onDelete={handleDelete} />
        </Card>
      ))}
    </div>
  );
};
