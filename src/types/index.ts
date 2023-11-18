export interface PackageInfo {
  name: string
  scope: string
  version: string
  description: string
  keywords: string[]
  date: Date
  links: {
    npm: string
    homepage: string
    repository: string
    bugs: string
  }
  author: {
    name: string
  }
  publisher: {
    username: string
    email: string
  }
  maintainers: Array<{
    username: string
    email: string
  }>
}

export interface PackageFromSearch {
  package: PackageInfo
  searchScore: number
}

export interface PackageNpmMetadata {
  type: string
  name: string
  tags: Array<any>
  versions: Array<PackageVersion>
  links: {
    stats: string
  }
}

interface PackageVersion {
  version: string
  links: {
    self: string
    entrypoints: string
    stats: string
  }
}

export interface PackagesList {
  objects: Array<PackageFromSearch>
  total: number
}