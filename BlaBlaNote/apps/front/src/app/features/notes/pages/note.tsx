import { Tag } from 'antd';
import records from '../../share/mockdata/records';
import { useState } from 'react';
import ActionsBar from '../components/note/actions-bar';
import { useParams } from 'react-router-dom';

export const Note = () => {
  const [notes, setNotes] = useState(records);
  const { id } = useParams();
  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));

    console.log(notes);
    console.log(`Note with id ${id} deleted`);
    console.log(notes);
  };
  return (
    <div>
      {notes.map((note) =>
        note.id === id ? (
          <div key={note.id}>
            <ActionsBar id={note.id} onDelete={handleDelete} />
            <p>this is the id : {id}</p>
            <div className="w-4/6 bg-white shadow-md rounded-lg p-6 m-auto">
              <h1 className="text-3xl font-bold">Note : {note.title}</h1>

              <Tag
                bordered={false}
                className="bg-gray-100 text-sm px-3 mt-3 mb-3 rounded-full font-medium text-gray-800"
              >
                {note.createdAt}
              </Tag>
            </div>
            <br />
            <div className="w-4/6 bg-white shadow-md rounded-lg p-6 m-auto">
              <h1 className="text-3xl font-bold">Note Summary</h1>
              <br />
              <span className="text-gray-600">
                AI-generated summary of key points
              </span>
              <br />
              <br />
              <p>{note.content}</p>
            </div>

            <br />

            <div className="w-4/6 bg-white shadow-md rounded-lg p-6 m-auto">
              <h1 className="text-3xl font-bold">Full trnscription</h1>
              <br />
              <span className="text-gray-600">
                Full transcription of the audio recording
              </span>
              <br />
              <br />
              <p>{note.summary}</p>
            </div>
          </div>
        ) : (
          ''
        )
      )}
    </div>
  );
};
