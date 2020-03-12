export interface Movie {
  id?: string
  name: string
  screens: Screen[]
}

export interface Screen {
  url: string
  path: string
}
