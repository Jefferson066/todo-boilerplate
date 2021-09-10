export const todolistSch = {
  image: {
    type: String,
    label: 'Imagem',
    defaultValue: '',
    optional: false,
    isImage: true,
  },
  title: {
    type: String,
    label: 'Título',
    defaultValue: '',
    optional: false,
  },
  username: {
    type: String,
    label: 'Username',
    defaultValue: '',
    optional: false,
  },
  description: {
    type: String,
    label: 'Descrição',
    defaultValue: '',
    optional: false,
  },
  type: {
    type: String,
    label: 'Tipo',
    defaultValue: '',
    optional: true,
  },
  date: {
    type: Date,
    label: 'Data',
    defaultValue: '',
    optional: true,
  },
  statusTask: {
    type: String,
    label: 'Status',
    defaultValue: '',
    optional: false,
  },
};
export interface ITodoList {
  _id?: string;
  image: string;
  title: string;
  description: string;
  createdat: Date;
  updatedat: Date;
  createdby: string;
}
