import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { todolistApi } from '../../api/todolistApi';
import SimpleForm from '../../../../ui/components/SimpleForm/SimpleForm';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import SelectField from '../../../../ui/components/SimpleFormFields/SelectField/SelectField';
import ImageCompactField from '/imports/ui/components/SimpleFormFields/ImageCompactField/ImageCompactField';
import * as appStyle from '/imports/materialui/styles';
import Print from '@material-ui/icons/Print';
import Close from '@material-ui/icons/Close';
import { PageLayout } from '/imports/ui/layouts/pageLayout';
import DatePickerField from '/imports/ui/components/SimpleFormFields/DatePickerField/DatePickerField';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';

interface ITodolistDetail {
  screenState: string;
  loading: boolean;
  todolistDoc: object;
  save: { (doc: object, callback?: {}): void };
  history: { push(url: string): void };
}

const TodolistDetail = ({
  isPrintView,
  screenState,
  loading,
  user,
  todolistDoc,
  save,
  history,
}: ITodolistDetail) => {
  const [username, setUsername] = React.useState('');

  useEffect(() => {
    if (user !== null) {
      setUsername((u) => user.username);
    }
  }, [user]);

  if (todolistDoc === undefined) {
    todolistDoc = user
      ? (todolistDoc = { username: username, statusTask: 'cadastrada' })
      : (todolistDoc = { username: '', value: '' });
  }
  console.log(todolistDoc);

  const handleStatusChange = (e, status) => {
    e.preventDefault();
    Meteor.call('todolist.situacao.update', todolistDoc._id, status);
    console.log('botao clicado', status);
    //history.push('/todolist');
  };

  const handleSubmit = (doc: object) => {
    save(doc);
  };
  return (
    <PageLayout
      title={
        screenState === 'view'
          ? 'Visualizar Tarefa'
          : screenState === 'edit'
          ? 'Editar Tarefa'
          : 'Criar Tarefa'
      }
      onBack={() => history.push('/todolist')}
      actions={[
        !isPrintView ? (
          <span
            style={{ cursor: 'pointer', marginRight: 10, color: appStyle.primaryColor }}
            onClick={() => {
              history.push(`/todolist/printview/${todolistDoc._id}`);
            }}
          >
            <Print />
          </span>
        ) : (
          <span
            style={{ cursor: 'pointer', marginRight: 10, color: appStyle.primaryColor }}
            onClick={() => {
              history.push(`/todolist/view/${todolistDoc._id}`);
            }}
          >
            <Close />
          </span>
        ),
      ]}
    >
      <SimpleForm
        mode={screenState}
        schema={todolistApi.schema}
        doc={todolistDoc}
        onSubmit={handleSubmit}
        loading={loading}
      >
        <ImageCompactField label={'Imagem Zoom+Slider'} name={'image'} />
        <FormGroup key={'fieldsOne'}>
          <TextField placeholder="Titulo" name="title" />
          <input type="hidden" name="username" id="username" />
          <TextField placeholder="Descrição" name="description" />
        </FormGroup>
        {/*<GoogleApiWrapper*/}
        {/*    name={'address'}*/}
        {/*/>*/}
        <FormGroup key={'fieldsTwo'}>
          <SelectField
            placeholder="Tipo"
            options={[
              { value: 'publica', label: 'Pública' },
              { value: 'privada', label: 'Privada' },
            ]}
            name="type"
          />
        </FormGroup>
        <FormGroup key={'fieldsThree'}>
          <DatePickerField placeholder="Data" name="date" />
        </FormGroup>
        {screenState == 'view' && (
          <>
            <Typography variant={'h6'}>
              {`Sua tarefa está ${
                todolistDoc.statusTask
                  ? todolistDoc.statusTask.toUpperCase()
                  : todolistDoc.statusTask
              }, deseja alterar para:`}
              {todolistDoc.statusTask === 'cadastrada' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    handleStatusChange(e, 'andamento');
                  }}
                >
                  Em Andamento
                </Button>
              )}
              {todolistDoc.statusTask === 'andamento' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    handleStatusChange(e, 'concluida');
                  }}
                >
                  Concluída
                </Button>
              )}
              {todolistDoc.statusTask === 'concluida' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    handleStatusChange(e, 'cadastrada');
                  }}
                >
                  Cadastrada
                </Button>
              )}
              {'?'}
            </Typography>
          </>
        )}

        <input type="hidden" name="statusTask" id="statusTask" />

        <div
          key={'Buttons'}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'left',
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {!isPrintView ? (
            <Button
              key={'b1'}
              style={{ marginRight: 10 }}
              onClick={
                screenState === 'edit'
                  ? () => history.push(`/todolist/view/${todolistDoc._id}`)
                  : () => history.push(`/todolist/list`)
              }
              color={'secondary'}
              variant="contained"
            >
              {screenState === 'view' ? 'Voltar' : 'Cancelar'}
            </Button>
          ) : null}

          {!isPrintView && screenState === 'view' ? (
            <Button
              key={'b2'}
              onClick={() => history.push(`/todolist/edit/${todolistDoc._id}`)}
              color={'primary'}
              variant="contained"
            >
              {'Editar'}
            </Button>
          ) : null}
          {!isPrintView && screenState !== 'view' ? (
            <Button key={'b3'} color={'primary'} variant="contained" submit="true">
              {'Salvar'}
            </Button>
          ) : null}
        </div>
      </SimpleForm>
    </PageLayout>
  );
};

interface ITodolistDetailContainer {
  screenState: string;
  id: string;
  history: { push(url: string): void };
  showNotification: (data: { type: string; title: string; description: string }) => void;
}

export const TodolistDetailContainer = withTracker((props: ITodolistDetailContainer) => {
  const { screenState, id } = props;
  const { user } = props;
  const subHandle = !!id ? todolistApi.subscribe('default', { _id: id }) : null;
  let todolistDoc = id && subHandle.ready() ? todolistApi.findOne({ _id: id }) : {};
  return {
    user,
    screenState,
    todolistDoc,
    save: (doc, callback) =>
      todolistApi[screenState === 'create' ? 'insert' : 'update'](doc, (e, r) => {
        if (!e) {
          props.history.push(`/todolist/view/${screenState === 'create' ? r : doc._id}`);
          props.showNotification({
            type: 'success',
            title: 'Operação realizada!',
            description: `A tarefa foi ${doc._id ? 'atualizada' : 'cadastrada'} com sucesso!`,
          });
        } else {
          console.log('Error:', e);
          props.showNotification({
            type: 'error',
            title: 'Operação não realizada!',
            description: `Erro ao realizar a operação: ${e.message}`,
          });
        }
      }),
  };
})(TodolistDetail);
