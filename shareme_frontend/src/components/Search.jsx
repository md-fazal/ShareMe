import React, { useEffect } from 'react'
import { feedQuery, searchQuery } from '../utils/data'
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import { useState } from 'react';
import Spinner from './Spinner';

const Search = ({setSearchTerm, searchTerm}) => {

  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(searchTerm.replace(/[';]/g, '')) {
      const query = searchQuery(searchTerm.replace(/[';]/g, ''))
      setLoading(true)
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false)
      })
    }
    else{
      setLoading(true)
      client.fetch(feedQuery).then((data) => {
      setPins(data);
      setLoading(false)
    })
    .catch()

    }
    
  }, [searchTerm])
  return (<div>
    {loading && <Spinner message="searching for pins"></Spinner>}
    {pins?.length && <MasonryLayout pins={pins}></MasonryLayout>}
    {pins?.length === 0 && searchQuery !== '' && !loading && (
      <div className='mt-10 text-xl text-center'>No Pins Found</div>
    )}
  </div>
  ) 
}

export default Search