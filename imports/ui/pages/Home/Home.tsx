import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { userprofileApi } from '/imports/userprofile/api/UserProfileApi';
import { todolistApi } from '/imports/modules/todolist/api/todolistApi';
import Link from '@material-ui/core/Link';
import _ from 'lodash';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import { SimpleCard } from '../../components/card';
import { CardButton } from '../../components/CardButton';
import { Typography } from '@material-ui/core';
//import * as appStyle from '/imports/materialui/styles';

const Home = () => {
  const userId = Meteor.userId();
  const subHandle = userprofileApi.subscribe('default', { _id: userId });
  const user = subHandle.ready() ? userprofileApi.findOne({ _id: userId }) : {};

  ////////////////////////////////////// tasks ////////////////////////////////
  const filterTasksPublicAndPrivate = {
    ...{
      $or: [{ type: 'publica' }, { createdby: userId, type: 'privada' }],
    }, // todas tasks publica do banco, e tasks privada do usuario
  };
  const subHandleTask = todolistApi.subscribe('default', filterTasksPublicAndPrivate, {});

  const todolists = subHandleTask.ready()
    ? todolistApi.find(filterTasksPublicAndPrivate, {}).fetch()
    : [];

  let registeredTasks = todolists.filter((obj) => obj.statusTask === 'cadastrada');
  let tasksProgress = todolists.filter((obj) => obj.statusTask === 'andamento');
  let completedTasks = todolists.filter((obj) => obj.statusTask === 'concluida');
  /////////////////////////////////

  return (
    <>
      {userId ? (
        <Container>
          <div
            style={{
              display: 'flex',
              'flex-direction': 'row',
              'justify-content': 'center',
              'margin-top': '70px',
            }}
          >
            <Typography variant={'h5'}>
              {`Olá ${user ? user.username : null}, seja bem vindo ao Todo List!`}
            </Typography>
          </div>

          <div
            style={{
              display: 'flex',
              'flex-direction': 'row',
              'justify-content': 'center',
              'margin-top': '30px',
            }}
          >
            <SimpleCard title={'Cadastradas'} textValue={registeredTasks.length} />
            <SimpleCard title={'Andamento'} textValue={tasksProgress.length} />
          </div>
          <div
            style={{
              display: 'flex',
              'flex-direction': 'row',
              'justify-content': 'center',
              'margin-top': '20px',
            }}
          >
            <SimpleCard title={'Concluídas'} textValue={completedTasks.length} />
            <CardButton title={'Visualizar Tarefas'} />
          </div>
        </Container>
      ) : (
        <Container>
          <h1>Advanced Todo List</h1>
          <p>
            Para acessar o sistema você deve realizar{' '}
            <Link style={{ fontSize: 17 }} component={RouterLink} to={'/signin'}>
              Login
            </Link>
          </p>
          <p>
            É novo por aqui ?{' '}
            <Link style={{ fontSize: 17 }} component={RouterLink} to={'/signup'}>
              Cadastre-se
            </Link>
          </p>
        </Container>
      )}
    </>
  );
};

export default Home;
