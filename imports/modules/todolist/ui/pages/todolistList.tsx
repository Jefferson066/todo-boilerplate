import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { todolistApi } from '../../api/todolistApi';
import SimpleTable from '/imports/ui/components/SimpleTable/SimpleTable';
import _ from 'lodash';

import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import TablePagination from '@mui/material/TablePagination';
import { makeStyles } from '@mui/styles';
import { ReactiveVar } from 'meteor/reactive-var';
import { initSearch } from '../../../../libs/searchUtils';

import * as appStyle from '/imports/materialui/styles';

import shortid from 'shortid';
import { PageLayout } from '/imports/ui/layouts/pageLayout';
import { Meteor } from 'meteor/meteor';
import { MyCheckbox } from '/imports/ui/components/CheckBoxCompletedTask';

interface ITodolistList {
  todolists: object[];
  history: object;
  userId: string;
  remove: (doc: object) => void;
  showDialog: (dialog: object) => void;
  onSearch: (text?: string) => void;
  total: number;
  loading: boolean;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  searchBy?: any;
  pageProperties: object;
}

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  selectDropdown: { color: '#fff', backgroundColor: '#1b1f38' },
  menuItem: {
    '&:hover': {
      backgroundColor: '#3b3f58',
    },
  },
  space: {
    flex: 'none',
    width: 'fit-content',
  },
  caption: {
    flex: 'none',
    width: 'fit-content',
  },
});

const TodolistList = ({
  todolists,
  history,
  userId,
  remove,
  showDialog,
  onSearch,
  total,
  loading,
  setPage,
  setPageSize,
  searchBy,
  pageProperties,
  stateCheck,
  handleChangecompleted,
}: ITodolistList) => {
  const classes = useStyles();
  const idTodolist = shortid.generate();

  //console.log(typeof userId);

  const onClick = (event, id, doc, showDialog) => {
    history.push('/todolist/view/' + id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 4));
    setPage(1);
  };
  const [text, setText] = React.useState(searchBy || '');
  const change = (e) => {
    if (text.length !== 0 && e.target.value.length === 0) {
      onSearch();
    }
    setText(e.target.value);
  };
  const keyPress = (e, a) => {
    // if (e.key === 'Enter') {
    if (text && text.trim().length > 0) {
      onSearch(text.trim());
    } else {
      onSearch();
    }
    // }
  };

  const click = (...e) => {
    if (text && text.trim().length > 0) {
      onSearch(text.trim());
    } else {
      onSearch();
    }
  };

  const callRemove = (doc) => {
    const { createdby } = doc;
    let dialogOptions = {};
    if (createdby === userId) {
      dialogOptions = {
        icon: <Delete />,
        title: 'Remover Tarefa',
        content: () => <p>{`Deseja remover a Tarefa ?"${doc.title}"?`}</p>,
        actions: ({ closeDialog }) => [
          // eslint-disable-next-line react/jsx-key
          <Button variant="contained" color={'secondary'} onClick={closeDialog}>
            {'Não'}
          </Button>,
          // eslint-disable-next-line react/jsx-key
          <Button
            onClick={() => {
              remove(doc);
              closeDialog();
            }}
            variant="contained"
            color={'primary'}
          >
            {'Sim'}
          </Button>,
        ],
      };
    } else {
      dialogOptions = {
        icon: <Delete />,
        title: 'Você nao tem permissão!',
        content: () => <p>{`Você nao tem permissão para Remover a Tarefa!`}</p>,
        actions: ({ closeDialog }) => [
          // eslint-disable-next-line react/jsx-key
          <Button variant="contained" color={'secondary'} onClick={closeDialog}>
            {'Ok'}
          </Button>,
        ],
      };
    }
    showDialog(dialogOptions);
  };

  return (
    <PageLayout title={'Lista de Tarefas'} actions={[]}>
      <TextField
        value={text}
        onChange={change}
        onKeyPress={keyPress}
        placeholder="Pesquisar..."
        action={{ icon: 'search', onClick: click }}
      />
      <MyCheckbox state={stateCheck} handleChangecompleted={handleChangecompleted} />
      <SimpleTable
        schema={_.pick(todolistApi.schema, ['image', 'title', 'username', 'date'])}
        data={todolists}
        onClick={onClick}
        actions={[{ icon: <Delete />, id: 'delete', onClick: callRemove }]}
      />
      <div
        style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <TablePagination
          style={{ width: 'fit-content', overflow: 'unset' }}
          rowsPerPageOptions={[4, 10, 25, 50, 100]}
          labelRowsPerPage={<div style={{ width: 0, padding: 0, margin: 0 }} />}
          component="div"
          count={total}
          rowsPerPage={pageProperties.pageSize}
          page={pageProperties.currentPage - 1}
          onPageChange={handleChangePage} // onChangePage aterado para onPageChange
          onRowsPerPageChange={handleChangeRowsPerPage} //onChangeRowsPerPage alterado para onRowsPerPageChange
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            MenuProps: { classes: { paper: classes.selectDropdown } },
          }}
          classes={{ menuItem: classes.menuItem, spacer: classes.space, caption: classes.caption }}
        />
      </div>
      <div style={appStyle.fabContainer}>
        <Fab
          id={'add'}
          onClick={() => history.push(`/todolist/create/${idTodolist}`)}
          color={'primary'}
        >
          <Add />
        </Fab>
      </div>
    </PageLayout>
  );
};

export const subscribeConfig = new ReactiveVar({
  pageProperties: {
    currentPage: 1,
    pageSize: 4,
  },
  sortProperties: { field: 'createdat', sortAscending: true },
  filter: {},
  searchBy: null,
});

const todolistSearch = initSearch(
  todolistApi, // API
  subscribeConfig, // ReactiveVar subscribe configurations
  ['title', 'description'], // list of fields
);

let onSearchTodolistTyping;
export const TodolistListContainer = withTracker((props) => {
  const userId = Meteor.userId();
  //Reactive Search/Filter
  const config = subscribeConfig.get();
  const sort = {
    [config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1,
  };
  todolistSearch.setActualConfig(config);

  ////*************checkbox****************** */
  const [stateCheck, setStateCheck] = React.useState(false); // estado do CHECKBOX
  const handleChangecompleted = (e) => {
    setStateCheck(!stateCheck);
  };
  console.log(stateCheck);
  ///********************************************** */

  //Subscribe parameters
  const filter = {
    ...config.filter,
    ...{
      $or: [{ type: 'publica' }, { createdby: userId, type: 'privada' }],
    },
  };

  const filterCheckCompleted = {
    ...config.filter,
    ...{
      // funcionando
      $or: [{ type: 'publica' }, { createdby: userId, type: 'privada' }],
      $and: [{ statusTask: 'concluida' }], // busca para so concluidas
    },
  };

  const limit = config.pageProperties.pageSize;
  const skip = (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize;
  //Collection Subscribe
  const subHandle = todolistApi.subscribe('default', filter, { sort, limit, skip });
  //const subHandle = Meteor.subscribe('todolist.tasks.public-private', userId);
  const todolists = subHandle.ready() ? todolistApi.find(filter, { sort }).fetch() : [];

  return {
    stateCheck,
    handleChangecompleted,
    userId,
    todolists,
    loading: !!subHandle && !subHandle.ready(),
    remove: (doc) => {
      todolistApi.remove(doc, (e, r) => {
        if (!e) {
          props.showNotification({
            type: 'success',
            title: 'Operação realizada!',
            message: `A Tarefa foi removida com sucesso!`,
          });
        } else {
          console.log('Error:', e);
          props.showNotification({
            type: 'error',
            title: 'Operação não realizada!',
            message: `Erro ao realizar a operação: ${e.message}`,
          });
        }
      });
    },
    searchBy: config.searchBy,
    onSearch: (...params) => {
      onSearchTodolistTyping && clearTimeout(onSearchTodolistTyping); /////////////
      onSearchTodolistTyping = setTimeout(() => {
        config.pageProperties.currentPage = 1;
        subscribeConfig.set(config);
        todolistSearch.onSearch(...params);
      }, 1000);
    },
    total: subHandle ? subHandle.total : todolists.length,
    pageProperties: config.pageProperties,
    filter,
    sort,
    setPage: (page = 1) => {
      config.pageProperties.currentPage = page;
      subscribeConfig.set(config);
    },
    setFilter: (newFilter = {}) => {
      config.filter = { ...filter, ...newFilter };
      Object.keys(config.filter).forEach((key) => {
        if (config.filter[key] === null || config.filter[key] === undefined) {
          delete config.filter[key];
        }
      });
      subscribeConfig.set(config);
    },
    setSort: (sort = {}) => {
      config.sort = sort;
      subscribeConfig.set(config);
    },
    setPageSize: (size = 4) => {
      config.pageProperties.pageSize = size;
      subscribeConfig.set(config);
    },
  };
})(TodolistList);
