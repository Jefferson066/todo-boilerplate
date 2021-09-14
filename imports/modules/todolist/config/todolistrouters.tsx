import React from 'react';
//////////////////////
import TodoListContainer from '../ui/pages/todolistContainer';
/////////////////////
export const todolistRouterList = [
  {
    path: '/todolist/:screenState/:todolistId',
    exact: true,
    component: TodoListContainer,
    isProtected: true,
  },
  {
    path: '/todolist/:screenState',
    exact: true,
    component: TodoListContainer,
    isProtected: true,
  },
  {
    path: '/todolist',
    exact: true,
    component: TodoListContainer,
    isProtected: true,
  },
];
