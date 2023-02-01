import React from 'react';
import { useParams } from 'react-router-dom';
 
const withRouter = WrappedComponent => props => {
  const params = useParams();
  localStorage.setItem('id',params.id);
  localStorage.setItem('quote',params.quote);
  return (
    <WrappedComponent
      {...props}
      params={params}
    />
  );
};
 
export default withRouter;