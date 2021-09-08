import React from 'react';
import Meteor from 'meteor/meteor';
import { TodolistListContainer } from './todolistList';
import { TodolistDetailContainer } from './todolistDetail';

export default (props: any) => {
  const validState = ['view', 'edit', 'create', 'fullView'];

  const screenState =
    props.match && props.match.params && !!props.match.params.screenState
      ? props.match.params.screenState
      : undefined;

  const id =
    props.match && props.match.params && !!props.match.params.todolistId
      ? props.match.params.todolistId
      : Meteor.todolistId;

  const isPrintView = screenState && screenState.indexOf('print') === 0;
  const isFullView = screenState && screenState.indexOf('full') === 0;

  const newScreenState = screenState
    ? isPrintView
      ? screenState.split('print')[1]
      : isFullView
      ? screenState.split('full')[1]
      : screenState
    : undefined;

  if (!!newScreenState && validState.indexOf(newScreenState) !== -1) {
    if (newScreenState === 'view' && !!id) {
      return (
        <TodolistDetailContainer
          {...props}
          screenState={newScreenState}
          isPrintView={isPrintView}
          isFullView={isFullView}
          id={id}
        />
      );
    } else if (newScreenState === 'edit' && !!id) {
      return (
        <TodolistDetailContainer
          {...props}
          screenState={newScreenState}
          isPrintView={isPrintView}
          isFullView={isFullView}
          id={id}
          edit
        />
      );
    } else if (newScreenState === 'create' && !!id) {
      return (
        <TodolistDetailContainer
          DetailContainer
          {...props}
          screenState={newScreenState}
          isPrintView={isPrintView}
          isFullView={isFullView}
          id={id}
          create
        />
      );
    }
  } else {
    return <TodolistListContainer {...props} isPrintView={isPrintView} isFullView={isFullView} />;
  }
};
