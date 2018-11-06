// 获取state中的singer
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const currentIndex = state => state.currentIndex

export const mode = state => state.mode

export const sequanceList = state => state.sequanceList

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

export const disc = state => state.disc

export const topList = state => state.topList

export const searchHistory = state => state.searchHistory

export const playRecent = state => state.playRecent
