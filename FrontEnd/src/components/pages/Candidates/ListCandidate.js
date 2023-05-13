import React, { useState } from 'react';
import { List} from '@mui/material';
import CandidateItem from './CandidateItem';
import ModalCandidate from './ModalCandidate';

const ListCandidate = ({ candidates }) => {
const [openModal, setOpenModal] = useState(false);
const [selectedCandidate, setSelectedCandidate] = useState(null);
const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenModal(true);
  };
const handleCloseModal = () => {
    setSelectedCandidate(null);
    setOpenModal(false);
  };
return (
    <List key="candidate-item">
      {candidates.map((candidate) => (
        <CandidateItem key={candidate.email}  candidate={candidate} onCandidateClick={handleCandidateClick}/>
      ))}
      {selectedCandidate && (
        <ModalCandidate candidate={selectedCandidate} open={openModal} handleClose={handleCloseModal} />
      )}
    </List>
  );
};

export default ListCandidate;
