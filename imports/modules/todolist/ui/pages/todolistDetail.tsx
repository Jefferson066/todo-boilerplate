import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { todolistApi } from '../../api/todolistApi';
import SimpleForm from '../../../../ui/components/SimpleForm/SimpleForm';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import TextMaskField from '../../../../ui/components/SimpleFormFields/TextMaskField/TextMaskField';
import ToggleSwitchField from '../../../../ui/components/SimpleFormFields/ToggleField/ToggleField';
import RadioButtonField from '../../../../ui/components/SimpleFormFields/RadioButtonField/RadioButtonField';

import SelectField from '../../../../ui/components/SimpleFormFields/SelectField/SelectField';
import UploadFilesCollection from '../../../../ui/components/SimpleFormFields/UploadFiles/uploadFilesCollection';

import ChipInput from '../../../../ui/components/SimpleFormFields/ChipInput/ChipInput';
import SliderField from '/imports/ui/components/SimpleFormFields/SliderField/SliderField';
import AudioRecorder from '/imports/ui/components/SimpleFormFields/AudioRecorderField/AudioRecorder';
import ImageCompactField from '/imports/ui/components/SimpleFormFields/ImageCompactField/ImageCompactField';
import * as appStyle from '/imports/materialui/styles';
import Print from '@material-ui/icons/Print';
import Close from '@material-ui/icons/Close';
import { PageLayout } from '/imports/ui/layouts/pageLayout';

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
  todolistDoc,
  save,
  history,
}: ITodolistDetail) => {
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
          <TextField placeholder="Descrição" name="description" />
        </FormGroup>
        {/*<GoogleApiWrapper*/}
        {/*    name={'address'}*/}
        {/*/>*/}
        <FormGroup key={'fieldsTwo'}>
          <SelectField
            placeholder="Tipo"
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'extra', label: 'Extra' },
            ]}
            name="type"
          />
          <SelectField placeholder="Tipo2" id="Tipo2" name="type2" />
        </FormGroup>
        <FormGroup key={'fieldsThree'} formType={'subform'} name={'contacts'}>
          <TextMaskField placeholder="Telefone" name="phone" />
          <TextMaskField placeholder="CPF" name="cpf" />
        </FormGroup>
        <FormGroup key={'fieldsFour'} formType={'subformArray'} name={'tasks'}>
          <TextField placeholder="Nome da Tarefa" name="name" />
          <TextField placeholder="Descrição da Tarefa" name="description" />
        </FormGroup>

        <SliderField placeholder="Slider" name="slider" />

        <ToggleSwitchField placeholder="Status da Tarefa" name="statusToggle" />

        <RadioButtonField
          placeholder="Opções da Tarefa"
          name="statusRadio"
          options={[
            { value: 'valA', label: 'Valor A' },
            { value: 'valB', label: 'Valor B' },
            { value: 'valC', label: 'Valor C' },
          ]}
        />

        <FormGroup key={'fields'}>
          <AudioRecorder placeholder="Áudio" name="audio" />
        </FormGroup>

        <UploadFilesCollection name="files" label={'Arquivos'} doc={todolistDoc} />
        <FormGroup key={'fieldsFive'} name={'chips'}>
          <ChipInput name="chip" placeholder="Chip" />
        </FormGroup>
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
  const subHandle = !!id ? todolistApi.subscribe('default', { _id: id }) : null;
  let todolistDoc = id && subHandle.ready() ? todolistApi.findOne({ _id: id }) : {};

  return {
    screenState,
    todolistDoc,
    save: (doc, callback) =>
      todolistApi[screenState === 'create' ? 'insert' : 'update'](doc, (e, r) => {
        if (!e) {
          props.history.push(`/todolist/view/${screenState === 'create' ? r : doc._id}`);
          props.showNotification({
            type: 'success',
            title: 'Operação realizada!',
            description: `O exemplo foi ${doc._id ? 'atualizado' : 'cadastrado'} com sucesso!`,
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
