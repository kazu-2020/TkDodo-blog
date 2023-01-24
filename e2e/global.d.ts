// add new command to the existing Cypress interface
declare global {
  namespace Cypress {
    interface Chainable {
      attachCoverPhoto: (imageType: string) => void;
      paste(data: { [type: string]: string }): Chainable;
      createPlaylist: (overrides?, addEpisodeCount?) => void;
      deleteAllPlaylists: () => void;
      createRecommendDeck: (overrides?, addPlaylistCount?) => void;
      deleteAllRecommendDeck: () => void;
      createSeriesDeck: (overrides?, addPlaylistCount?) => void;
      deleteAllSeriesDeck: () => void;
      createAnnouncement: (props?: {
        status?: string;
        contents?: string;
      }) => void;
    }
  }
}

export {};
