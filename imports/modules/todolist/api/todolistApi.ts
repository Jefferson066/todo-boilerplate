// region Imports
import { ApiBase } from '../../../api/base';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { todolistSch } from './todolistSch';

// endregion

class TodoListApi extends ApiBase {
  constructor(props) {
    super('todolist', todolistSch);
    if (Meteor.isServer) {
      this.registerMethod('situacao.update', (_id, status) => {
        check(_id, String);
        check(status, String);

        //if (!this.userId) {
        // throw new Meteor.Error('Not authorized!');
        //}

        this.collectionInstance.update(_id, {
          $set: {
            statusTask: status,
          },
        });
      });
    }

    this.addPublication('tasks.public-private', (userId) => {
      return this.collectionInstance.find({
        $or: [{ type: 'publica' }, { createdby: userId, type: 'privada' }],
      });
    });
  }
}

export const todolistApi = new TodoListApi();
