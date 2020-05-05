export const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];

export const MONTHS = [`jan`, `feb`, `mar`, `apr`, `may`, `jun`, `jul`, `aug`, `sep`, `oct`, `nov`, `dec`];

export const FILTER_TITLES = [`everything`, `future`, `past`];

export const EventType = {
  ALL: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`],
  TRANSFER: new Set([`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`]),
  ACTIVITY: new Set([`check-in`, `sightseeing`, `restaurant`])
};

