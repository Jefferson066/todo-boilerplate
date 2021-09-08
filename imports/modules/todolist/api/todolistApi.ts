// region Imports
import { ApiBase } from '../../../api/base';
import { todolistSch } from './todolistSch';

// endregion

class TodoListApi extends ApiBase {
  constructor(props) {
    super('todolist', todolistSch);
  }
}

export const todolistApi = new TodoListApi();
