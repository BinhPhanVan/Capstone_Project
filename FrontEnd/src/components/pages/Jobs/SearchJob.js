import React, { useState } from 'react';
import { Grid, FormControl, InputLabel, Input, Select, MenuItem } from '@material-ui/core';
import { PROVINCES } from '../../../constants/locations';
import ListJob from './ListJob';

function SearchJob() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };
  const jobs = [
    {
      id: 1,
      name: 'Software Engineer',
      company: 'ABC Company',
      skill: 'JavaScript, React, Node.js, Redux, Next.js, TypeScript, GraphQL, PostgreSQL, AWS, Docker, Kubernetes, Git, Agile methodology',
      location: 'Đà Nẵng'
    },
    {
      id: 2,
      name: 'Frontend Developer',
      company: 'XYZ Company',
      skill: 'HTML, CSS, JavaScript, React, Angular, Vue.js, Bootstrap, Material-UI, jQuery, Git, Agile methodology',
      location: 'Đà Nẵng'
    },
    {
      id: 3,
      name: 'Full Stack Developer',
      company: 'DEF Company',
      skill: 'Python, Django, Flask, FastAPI, React, Angular, Vue.js, PostgreSQL, MongoDB, Redis, Elasticsearch, AWS, Docker, Git, Agile methodology',
      location: 'Hà Nội'
    },
    {
      id: 4,
      name: 'Backend Developer',
      company: 'GHI Company',
      skill: 'Java, Spring Boot, Hibernate, Struts, JSP, Servlet, JUnit, Mockito, Maven, Git, Agile methodology',
      location: 'Thừa Thiên Huế'
    },
    {
      id: 5,
      name: 'Software Engineer',
      company: 'ABC Company',
      skill: 'JavaScript, React, Node.js, Redux, Next.js, TypeScript, GraphQL, PostgreSQL, AWS, Docker, Kubernetes, Git, Agile methodology',
      location: 'Đà Nẵng'
    },
    {
      id: 6,
      name: 'Frontend Developer',
      company: 'XYZ Company',
      skill: 'HTML, CSS, JavaScript, React, Angular, Vue.js, Bootstrap, Material-UI, jQuery, Git, Agile methodology',
      location: 'Đà Nẵng'
    },
    {
      id: 7,
      name: 'Full Stack Developer',
      company: 'DEF Company',
      skill: 'Python, Django, Flask, FastAPI, React, Angular, Vue.js, PostgreSQL, MongoDB, Redis, Elasticsearch, AWS, Docker, Git, Agile methodology',
      location: 'Hà Nội'
    },
    {
      id: 8,
      name: 'Backend Developer',
      company: 'GHI Company',
      skill: 'Java, Spring Boot, Hibernate, Struts, JSP, Servlet, JUnit, Mockito, Maven, Git, Agile methodology',
      location: 'Thừa Thiên Huế'
    },
    {
      id: 9,
      name: 'Backend Developer',
      company: 'GHI Company',
      skill: 'Java, Spring Boot, Hibernate, Struts, JSP, Servlet, JUnit, Mockito, Maven, Git, Agile methodology',
      location: 'Thừa Thiên Huế'
    }
  ];
    
  const filteredJobs = jobs.filter((job) =>
    job.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter((job) =>
      job.location.toLowerCase().includes(selectedProvince.toLowerCase())
  );

  return (
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
      <ListJob jobs={filteredJobs} />;
    </Grid>
  );
}

export default SearchJob;
