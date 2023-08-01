import { SyncLoader } from 'react-spinners';

const SpinnerLoading = ({ loading }) => {
  return (
    loading && (
      <div className="spinner-container">
        <div className="spinner-overlay"></div>
        <div className="spinner">
          <SyncLoader color={'#3689d6'} size={12} margin={3} />
        </div>
      </div>
    )
  );
};


export default SpinnerLoading;
