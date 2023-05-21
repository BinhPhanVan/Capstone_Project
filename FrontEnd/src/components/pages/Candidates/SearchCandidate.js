import React, { useEffect, useState } from 'react';
import { Grid, FormControl, InputLabel, Input, Select, MenuItem } from '@material-ui/core';
import { PROVINCES } from '../../../constants/locations';
import ListCandidate from './ListCandidate';
import { useDispatch, useSelector } from 'react-redux';
import { get_all_candidate, selectCandidates, selectIsLoading } from '../../../store/UserSlice';
import SpinnerLoading from '../../commons/SpinnerLoading';

function SearchCandidate() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const dispatch = useDispatch();
    const loading = useSelector(selectIsLoading);
    const data = useSelector(selectCandidates);
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleProvinceChange = (event) => {
        setSelectedProvince(event.target.value);
    };
    
    const candidates = [];

    data.forEach(candidate => {
    const { employee, phone_number, location, skills } = candidate;
    const { account } = employee;
    const { first_name, last_name, email, id } = account;
    const { avatar_url, pdf_file } =  employee;

    const shortenedCandidate = {
        id,
        name: `${first_name} ${last_name}`,
        email,
        phone_number,
        location,
        skills,
        avatar_url,
        pdf_file
    };
    candidates.push(shortenedCandidate);
    });
    

    const filteredCandidates = candidates.filter((candidate) =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).filter((candidate) =>
        candidate.location.toLowerCase().includes(selectedProvince.toLowerCase())
    );
    useEffect(()=> {
        document.title = "Search Candidate | Hire IT"
        dispatch(get_all_candidate());
    }, [dispatch]);

  return (
    <div>
        <SpinnerLoading loading={loading}/>
        <Grid container justifyContent="center"spacing={2} className='search_candidate-container'>
            <Grid Grid item>
                <FormControl className="search_candidate-form-container">
                    <InputLabel htmlFor="search" style={{ marginRight: '2rem' }}>
                        Search
                    </InputLabel>
                    <Input id="search" value={searchQuery} onChange={handleSearch} />
                </FormControl>
            </Grid>
            <Grid item>
                <FormControl>
                    <InputLabel id="province-select-label">Province</InputLabel>
                    <Select
                        labelId="province-select-label"
                        id="province-select"
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        style={{ minWidth: '150px'}}
                        MenuProps={{
                        classes: {
                            paper: 'my-custom-class'
                        },
                        style: {
                            maxHeight: '400px'
                        }
                        }}
                    >           
                        <MenuItem value="">All provinces</MenuItem>
                        {PROVINCES.map((province) => (
                        <MenuItem key={province} value={province}>
                            {province}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <ListCandidate candidates={filteredCandidates} />
        </Grid>
    </div>
  );
}

export default SearchCandidate;
