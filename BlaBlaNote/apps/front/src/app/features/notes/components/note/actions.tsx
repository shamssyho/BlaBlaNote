import React from 'react';
import {
  EyeOutlined,
  ShareAltOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

export const Actions = () => {
  return (
    <div className="flex items-center place-content-between gap-4">
      <div className="flex items-center gap-2 cursor-pointer pl-3 pr-3 pt-1 pb-1 border rounded-lg border-solid hover:text-blue-500 ">
        <EyeOutlined />
        <span className="">Voir</span>
      </div>
      <div className="flex items-center gap-2 pl-3 pr-3 pt-1 pb-1 ">
        <section className="cursor-pointer hover:text-blue-500 flex items-center gap-2 pl-3 pr-3 pt-1 pb-1">
          <ShareAltOutlined />
          <span className="ml-2 cursor-pointer">Partager</span>
        </section>

        <section className="cursor-pointer text-red-600 hover:text-red-700 flex items-center gap-2 pl-3 pr-3 pt-1 pb-1">
          <DeleteOutlined />
          <span className="ml-2 text-red-600 cursor-pointer hover:text-red-700">
            Supprimer
          </span>
        </section>
      </div>
    </div>
  );
};
