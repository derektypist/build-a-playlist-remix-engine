const playlists = [
  [
    {
      trackId: "trk101",
      artist: "Velvet Comet",
      title: "Crimson Afterglow",
      votes: 5,
      bpm: 122
    },
    {
      trackId: "trk102",
      artist: "Neon Harbor",
      title: "Static Horizon",
      votes: 2,
      bpm: 108
    },
    {
      trackId: "trk103",
      artist: "Lunar Arcade",
      title: "Midnight Frequency",
      votes: 4,
      bpm: 128
    }
  ],
  [
    {
      trackId: "trk201",
      artist: "Solar Echo",
      title: "Glass Skyline",
      votes: 3,
      bpm: 115
    },
    {
      trackId: "trk202",
      artist: "Velvet Comet",
      title: "Satellite Hearts",
      votes: 6,
      bpm: 124
    }
  ]
];

function flattenPlaylists(lists) {
  if (!Array.isArray(lists)) return [];
  let deepCopy = structuredClone(lists);
  for (let i=0;i<deepCopy.length;i++) {
    for (let j=0;j<deepCopy[i].length;j++) {
      if (JSON.stringify(Object.keys(deepCopy[i][j])) !== JSON.stringify(["trackId","artist","title","votes","bpm"])) return;
      deepCopy[i][j]["source"] = [i, j];
    }
  }
  return deepCopy.flat();
}

function scoreTracks(tracks) {
  let deepCopy = structuredClone(tracks);
  for (const track of deepCopy) {
    track.score = track.votes * 10 - Math.abs(track.bpm - 120);
  }
  return deepCopy;
}

function dedupeTracks(tracks) {
  let deepCopy = structuredClone(tracks);
  for (let i=0; i<deepCopy.length - 1;i++) {
    for (let j=i+1; j<deepCopy.length;j++) {
      if (deepCopy[i].trackId === deepCopy[j].trackId) deepCopy.splice(j, 1);
    }
  }
  return deepCopy;
}

function enforceArtistQuota(tracks, max) {
  if (max < 1) return 0;
  let deepCopy = structuredClone(tracks);

  for (let i=0; i<deepCopy.length - 1; i++) {
    let occurrences = 0;
    for (let j= i+1;j<deepCopy.length; j++ ) {
      if (deepCopy[i].artist === deepCopy[j].artist) {
        occurrences++;
        if (occurrences >= max) deepCopy.splice(j, 1);
      }
    }
  }
  return deepCopy;
}

function buildSchedule(tracks) {
  let deepCopy = structuredClone(tracks);
  let schedule = [];
  for (let i=0; i<tracks.length; i++) {
    schedule.push({slot: i+1, trackId: deepCopy[i].trackId});
  }
  return schedule;
}

function remixPlaylist(lists, max) {
  let copy = structuredClone(lists);
  
  const remix = buildSchedule(enforceArtistQuota(dedupeTracks(scoreTracks(flattenPlaylists(copy))), max));
  return remix;
}

console.log(remixPlaylist(playlists, 1));
