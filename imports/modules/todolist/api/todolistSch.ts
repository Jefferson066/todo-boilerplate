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
    optional: false,
  },
  date: {
    type: Date,
    label: 'Data',
    defaultValue: '',
    optional: true,
  },
  statusRadio: {
    type: String,
    label: 'Status RadioButton',
    defaultValue: '',
    optional: false,
    radiosList: ['Todo', 'Doing', 'Done'],
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
