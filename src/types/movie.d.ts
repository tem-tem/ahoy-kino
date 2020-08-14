export interface Movie {
  id?: string
  name: string
  screens: Screen[]
  directLink: string
  first_air_date?: string
  release_date?: string
  genres: Genre[]
  poster_path: string
  runtime?: integer
  number_of_seasons?: number
  number_of_episodes?: number
  overview: string
  status: string
  popularity: number
  vote_average: number
  release_date: string
  tmdb_id: string
}

export interface Genre {
  id: number
  name: string
}

export interface Screen {
  name: string
  // remove below
  publicUrls: {
    thumb: string
    full: string
  }
  // remove above
  public_urls: {
    thumb: string
    full: string
  }
  url: string
  path: string
  order: number
}

export interface AllMoviesStats {
  totalAmount: number
}
