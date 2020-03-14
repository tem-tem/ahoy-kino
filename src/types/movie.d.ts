export interface Movie {
  id?: string
  name: string
  screens: Screen[]
  directLink: string
  first_air_date?: string
  release_date?: string
  genres: Genre[]
}

export interface Genre {
  id: number
  name: string
}

export interface Screen {
  url: string
  path: string
  order: number
}
