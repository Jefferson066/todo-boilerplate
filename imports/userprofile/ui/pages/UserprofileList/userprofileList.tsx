import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { userprofileApi } from '../../../api/UserProfileApi';
import { Meteor } from 'meteor/meteor';
import SimpleTable from '/imports/ui/components/SimpleTable/SimpleTable';
import _ from 'lodash';
import { PageLayout } from '/imports/ui/layouts/pageLayout';

const UserProfileList = ({ user, history }) => {
  const onClick = (event, id, doc) => {
    history.push('/userprofile/view/' + id);
  };

  return (
    <PageLayout title={'Usuário'} actions={[]}>
      <SimpleTable
        schema={_.pick(userprofileApi.schema, ['photo', 'username', 'email'])}
        data={user}
        onClick={onClick}
      />
    </PageLayout>
  );
};

export const UserProfileListContainer = withTracker((props) => {
  const id = Meteor.userId();
  const subHandle = userprofileApi.subscribe('default', {});
  const findUser = subHandle.ready() ? userprofileApi.findOne({ _id: id }) : [];
  const user = [];
  user.push(findUser);

  return {
    user,
  };
})(UserProfileList);
