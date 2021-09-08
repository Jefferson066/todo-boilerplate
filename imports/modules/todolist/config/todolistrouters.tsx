import React from 'react';
//////////////////////
import TodoListContainer from '../ui/pages/todolistContainer';
/////////////////////
export const todolistRouterList = [
  {
    path: '/todolist/:screenState/:todolistId',
    component: TodoListContainer,
    isProtected: true,
  },
  {
    path: '/todolist/:screenState',
    component: TodoListContainer,
    isProtected: true,
  },
  {
    path: '/todolist',
    component: TodoListContainer,
    isProtected: true,
  },
];
