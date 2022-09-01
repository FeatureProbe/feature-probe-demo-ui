import ReactGA from 'react-ga4';

export const EventTrack = {
  init() {
    ReactGA.initialize('G-3NE3REQG2T');
  },

  setUserId(userId: string) {
    ReactGA.set({ userId });
  },

  pageView(pathName: string) {
    ReactGA.send({ hitType: 'pageview', page: pathName });
  },

  track(category: string, action: string) {
    ReactGA.event({
      category,
      action,
    });
  },
};
