export interface Movie {
  id?: string
  name: string
  screens: Screen[]
  directLink: string
  first_air_date?: string
  release_date?: string
  genres: Genre[]
  poster_path: string
}

export interface Genre {
  id: number
  name: string
}

export interface Screen {
  name: string
  publicUrls: {
    thumb: string
    full: string
  }
  url: string
  path: string
  order: number
}
