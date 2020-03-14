export interface Movie {
  id?: string
  name: string
  screens: Screen[]
  directLink: string
}

export interface Screen {
  url: string
  path: string
  order: number
}
