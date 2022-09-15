interface DetailedContent {
  name: string
  contentUrl: string
  lowContentUrl?: string
  encodingFormat: string[]
  drmName?: string
  drmLicense?: string
  drmCert?: string
}

interface DetailedContentStatus {
  environmentId: string
  streamType: string
  contentStatus: string
}

interface VideoObjectIdentifierGroup {
  environmentId: string
  broadcastEventId?: string
  streamType: string
}

export type VideoObject = {
  name?: string
  description?: string
  caption?: string
  url?: string
  embedUrl?: string
  identifierGroup: VideoObjectIdentifierGroup
  detailedContentStatus: DetailedContentStatus
  detailedContent?: DetailedContent[]
  sprite?: any
  expires?: string
  thumbnailUrl?: string[]
  broadcastEvent?: any
}
