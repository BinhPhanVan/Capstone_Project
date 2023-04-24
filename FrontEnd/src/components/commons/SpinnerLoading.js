import React from 'react';
import { SyncLoader } from 'react-spinner';

const SpinnerLoading = ({ loading, color = '#3689d6', size = 10 }) => {
  return (
    loading && (
      <div className="spinner-container">
        <SyncLoader color={color} size={size} loading={loading} />
      </div>
    )
  );
};

export default SpinnerLoading;
