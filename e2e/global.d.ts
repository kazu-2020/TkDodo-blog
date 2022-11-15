// add new command to the existing Cypress interface
declare global {
  namespace Cypress {
    interface Chainable {
      attachCoverPhoto: (imageType: string) => void;
      paste(data: { [type: string]: string }): Chainable;
      createPlaylist: (overrides?, addEpisodeCount?) => void;
      deleteAllPlaylists: () => void;
      createRecommendDeck: (overrides?) => void;
      deleteAllRecommendDeck: () => void;
      createSeriesDeck: (overrides?) => void;
      deleteAllSeriesDeck: () => void;
    }
  }
}

export {};
