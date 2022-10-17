// add new command to the existing Cypress interface
declare global {
  namespace Cypress {
    interface Chainable {
      checkAndDismissNotification: (matcher: RegExp | string) => void;
      waitLoading: () => void;
      attachCoverPhoto: (imageType: string) => void;
      paste(data: {[type: string]: string}): Chainable
    }
  }
}

export {};
