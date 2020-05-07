import genreDefaults from './genres.json'
import React from 'react'
import { Genre } from '~/types'

interface Props {
  genres: Genre[]
}

export default ({ genres }: Props) => {
  // const baseGenres = genreDefaults.genres.filter((g) =>
  //   genreDefaults.base.includes(g.id)
  // )
  const genreIds = genres.map((g) => g.id)
  const settingIds = genreDefaults.setting.map((g) => g.id)
  const mediumIds = genreDefaults.medium.map((g) => g.id)
  const setting = genres.filter((g) => settingIds.includes(g.id))
  const medium = genres.filter((g) => mediumIds.includes(g.id))

  return (
    <div>
      {genreDefaults.base.map((g) => {
        return (
          <div key={`${g.id}-${g.name}`}>
            <span>{genreIds.includes(g.id) ? '+' : '-'}</span>
            <span>{g.name}</span>
          </div>
        )
      })}

      {setting.length > 0 && (
        <div>
          Setting:
          {setting.map((g) => {
            return <span key={`${g.id}-${g.name}`}>{g.name}</span>
          })}
        </div>
      )}

      {medium.length > 0 && (
        <div>
          Medium:
          {medium.map((g) => {
            return <span key={`${g.id}-${g.name}`}>{g.name}</span>
          })}
        </div>
      )}
    </div>
  )
}
