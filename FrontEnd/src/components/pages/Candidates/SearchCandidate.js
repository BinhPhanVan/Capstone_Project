import React, { useState } from 'react';
import { Grid, FormControl, InputLabel, Input, Select, MenuItem } from '@material-ui/core';
import { PROVINCES } from '../../../constants/locations';
import ListCandidate from './ListCandidate';

function SearchCandidate() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleProvinceChange = (event) => {
        setSelectedProvince(event.target.value);
    };
    const candidates = [
        {
            id: 1,
            name: "John Doe",
            skill: "JavaScript, React, Node.js, Redux, Next.js, TypeScript, GraphQL, PostgreSQL, AWS, Docker, Kubernetes, Git, Agile methodology",
            location: "An Giang",
            phoneNumber: "1234567890",
            email: "john.doe@example.com",
            avartar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwyMzQ5ODgwfHxlbnwwfHx8fA%3D%3D&w=1000&q=80"
          },
          {
            id: 2,
            name: "Jane Smith",
            skill: "Node.js, Redux, Node.js, Redux, Express.js, MongoDB, Firebase",
            location: "Đà Nẵng",
            phoneNumber: "9876543210",
            email: "jane.smith@example.com",
            avartar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwyMzQ5ODgwfHxlbnwwfHx8fA%3D%3D&w=1000&q=80"
          },
          {
            id: 3,
            name: "Bob Johnson",
            skill: "Next.js, TypeScript, Node.js, Redux, Express.js, MongoDB, Firebase",
            location: "Thừa Thiên Huế",
            phoneNumber: "5555555555",
            email: "bob.johnson@example.com",
            avartar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwyMzQ5ODgwfHxlbnwwfHx8fA%3D%3D&w=1000&q=80"
          }
    ];      
    
    const filteredCandidates = candidates.filter((candidate) =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).filter((candidate) =>
        candidate.location.toLowerCase().includes(selectedProvince.toLowerCase())
    );

  return (
    <Grid container spacing={2} className='search_candidate-container'>
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
  );
}

export default SearchCandidate;
