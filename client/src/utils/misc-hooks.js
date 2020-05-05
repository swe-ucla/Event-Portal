import {useState, useEffect} from 'react';
import axios from 'axios';

export const useMajors = (initialState) => {
    const [majors, setMajors] = useState(initialState);
  
    useEffect(() => {
      axios.get('/majors')
        .then(result => {
          let major_data = {};
          result.data.forEach((major) => {
            major_data[major.id] = major.name;
          });
          console.log(major_data);
          setMajors({...major_data});
        })
        .catch(err => console.log(err));
      return () => {
        setMajors({});
      }
    }, [])
  
    return {
      majors
    };
  }
  
  export const useOccupations = (initialState) => {
    const [occupations, setOccupations] = useState(initialState);
  
    useEffect(() => {
      axios.get('/occupations')
        .then(result => {
          let occupation_data = {};
          result.data.forEach((occupation) => {
            occupation_data[occupation.id] = occupation.name
          })
          console.log(occupation_data);
          setOccupations(occupation_data);
        })
        .catch(err => console.log(err));
      return () => {
        setOccupations({});
      }
    }, [])
  
    return {
       occupations 
    };
  }
  