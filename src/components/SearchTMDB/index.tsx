import React, { useState, useCallback, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import makeLink from '~/helpers/makeLink'

const apiKey = process.env.TMDB_KEY

interface SelectedMovie {
  value: string
  label: string
  media_type: string
}

interface Props {
  onMovieChange: (a: any) => void
  existingIds: number[]
}

const SearchTMDB = ({ onMovieChange, existingIds }: Props) => {
  const [selectedMovieLink, setSelectedMovieLink] = useState<SelectedMovie>()
  const promiseOptions = useCallback(
    (queryRaw: string) => {
      const query = encodeURI(queryRaw)
      if (query.length < 2) {
        return
      }
      return new Promise(resolve =>
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${query}&page=1&include_adult=false
    `)
          .then(response => {
            return response.json()
          })
          .then(data => {
            let res = []
            if (data.results) {
              const filtered = data.results.filter(
                f =>
                  (f.media_type === 'movie' || f.media_type === 'tv') &&
                  !existingIds.includes(f.id)
              )

              res = filtered.map(f => {
                return {
                  value: f.id,
                  label: `${f.name || f.title} [${
                    f.media_type
                  }] [${f.first_air_date || f.release_date}]`,
                  media_type: f.media_type,
                }
              })
            }
            resolve(res)
          })
      )
    },
    [existingIds]
  )

  useEffect(() => {
    if (selectedMovieLink) {
      const { value: id, media_type } = selectedMovieLink

      fetch(
        `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${apiKey}&language=en-US`
      )
        .then(response => response.json())
        .then(data => {
          Object.defineProperty(
            data,
            'tmdb_id',
            Object.getOwnPropertyDescriptor(data, 'id')
          )
          delete data['id']
          onMovieChange(data)
        })
    }
  }, [selectedMovieLink])

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      onChange={setSelectedMovieLink}
    />
  )
}

export default SearchTMDB
