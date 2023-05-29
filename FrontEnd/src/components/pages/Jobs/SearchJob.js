import React, { useEffect, useState } from 'react';
import { Grid, FormControl, InputLabel, Input, Select, MenuItem } from '@material-ui/core';
import { PROVINCES } from '../../../constants/locations';
import ListJob from './ListJob';
import { get_all_jobs, selectIsLoading, selectJobs } from '../../../store/JobSlice';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerLoading from '../../commons/SpinnerLoading';

function SearchJob() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(selectIsLoading);
  const data = useSelector(selectJobs);
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };
  const jobs = [];
  let index = 1;
  data.forEach(job => {
    const { job_name, location, pdf_upload, recruiter, skills } = job;
    const { company_name, avatar_url, account } = recruiter;
    const { first_name, last_name, email, id } =  account;

    const shortenedJob = {
        index: index,
        id,
        name: `${first_name} ${last_name}`,
        email,
        location,
        skills,
        avatar_url,
        pdf_upload, company_name, job_name
    };
    jobs.push(shortenedJob);
    index++;
    });
    
  const filteredJobs = jobs.filter((job) =>
    job.job_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter((job) =>
      job.location.toLowerCase().includes(selectedProvince.toLowerCase())
  );
  useEffect(()=> {
      document.title = "Search Job | Hire IT"
      dispatch(get_all_jobs());
  }, [dispatch]);

  return (
    <div>
      <SpinnerLoading loading={loading}/>
      <Grid container spacing={2} className='searchjob-container'>
        <Grid item>
          <FormControl className="searchjob-form-container">
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
        <ListJob jobs={filteredJobs} />
      </Grid>           
    </div>
  );
}

export default SearchJob;
