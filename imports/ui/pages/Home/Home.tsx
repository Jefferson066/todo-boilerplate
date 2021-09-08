import React from 'react';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import { Meteor } from 'meteor/meteor';
import * as appStyle from '/imports/materialui/styles';

const Home = () => {
  const userId = Meteor.userId();
  console.log(userId);
  return (
    <>
      {userId ? (
        <Container>
          <h1>Dashboard</h1>
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
