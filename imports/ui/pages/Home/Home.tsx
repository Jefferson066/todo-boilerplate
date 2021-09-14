import React from 'react';
import { Meteor } from 'meteor/meteor';
import { userprofileApi } from '/imports/userprofile/api/UserProfileApi';
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

  console.log(user.username);
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
            <SimpleCard title={'Cadastradas'} textValue={'66'} />
            <SimpleCard title={'Andamento'} textValue={'77'} />
          </div>
          <div
            style={{
              display: 'flex',
              'flex-direction': 'row',
              'justify-content': 'center',
              'margin-top': '20px',
            }}
          >
            <SimpleCard title={'Cadastradas'} textValue={'88'} />
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
