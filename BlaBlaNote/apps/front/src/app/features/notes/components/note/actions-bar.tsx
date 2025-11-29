import { Outlet } from 'react-router-dom';
import { ShareAltOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import records from '../../../share/mockdata/records';
import { useState } from 'react';
type ActionsProps = {
  id: string;
  onDelete: (id: string) => void;
};
export const ActionsBar = ({ onDelete, id }: ActionsProps) => {
    const [notes, setNotes] = useState(records);
  return (
    <div>
      <div className="w-f flex items-center justify-between bg-white shadow-md p-4 rounded-lg mb-4">
        <h1 className="text-xl font-semibold">Actions</h1>
        <div className="flex gap-4">
            {notes.map((note) => (
              <Link key={note.id} to={`/note/${note.id}`}>
                )
          }}
          <section className="cursor-pointer hover:text-blue-500 flex items-center gap-2 pl-3 pr-3 pt-1 pb-1">
            <ShareAltOutlined />
            <span className="ml-2 cursor-pointer">Partager</span>
          </section>

          <section className="cursor-pointer text-red-600 hover:text-red-700 flex items-center gap-2 pl-3 pr-3 pt-1 pb-1">
            <DeleteOutlined />
            <span
              onClick={() => onDelete(id)}
              className="ml-2 text-red-600 cursor-pointer hover:text-red-700"
            >
              Supprimer
            </span>
          </section>
        </>
      </div>
      {/* This Outlet will render the nested routes */}

      <Outlet />
    </div>
  );
};
export default ActionsBar;
