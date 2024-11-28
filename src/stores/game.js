import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
export const useGameStore = defineStore('game', () => {
    const storeError = useErrorStore()
    const game = ref(null)
    const multiplayerMostWins = ref(null)
    const singleplayerBestTime_BoardThreeFour = ref(null)
    const singleplayerBestTime_BoardFourFour = ref(null)
    const singleplayerBestTime_BoardSixSix = ref(null)

    //const getScoreboard = computed(() => scoreboard.value)

    const getMultiplayerMostWins = computed(() => {
        return multiplayerMostWins.value ? multiplayerMostWins.value : []
    })

    const getSinglePlayerBestTime_BoardThreeFour = computed(() => {
        return singleplayerBestTime_BoardThreeFour.value ? singleplayerBestTime_BoardThreeFour.value : []
    })

    const getSinglePlayerBestTime_BoardFourFour = computed(() => {
        return singleplayerBestTime_BoardFourFour.value ? singleplayerBestTime_BoardFourFour.value : []
    })

    const getSinglePlayerBestTime_BoardSixSix = computed(() => {
        return singleplayerBestTime_BoardSixSix.value ? singleplayerBestTime_BoardSixSix.value : []
    })

    const fetchScoreboard = async () => {
        storeError.resetMessages()
        try {
        
           //jogos multiplayer -> Mais vitórias
           const multiplayerMostWins_promise =  axios.get('topMultiplayerMostWins')
           //jogos singleplayer -> Melhor tempo (board 3x4)
           const singleplayerBestTime_BoardThreeFour_promise = axios.get('topSingleplayerBestTimeThreeFourBoard')
           //jogos singleplayer -> Melhor tempo (board 4x4)
           const singleplayerBestTime_BoardFourFour_promise = axios.get('topSingleplayerBestTimeFourFourBoard')
           //jogos singleplayer -> Melhor tempo (board 6x6)
           const singleplayerBestTime_BoardSixSix_promise = axios.get('topSingleplayerBestTimeSixSixBoard')

           multiplayerMostWins.value = (await multiplayerMostWins_promise).data
           singleplayerBestTime_BoardThreeFour.value = (await singleplayerBestTime_BoardThreeFour_promise).data
           singleplayerBestTime_BoardFourFour.value = (await singleplayerBestTime_BoardFourFour_promise).data
           singleplayerBestTime_BoardSixSix.value = (await singleplayerBestTime_BoardSixSix_promise).data

           return true

        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors,
                e.response.status, 'Cannot load scoreboard!')
            return false
        }
    }
   
    return {
        fetchScoreboard, getMultiplayerMostWins, getSinglePlayerBestTime_BoardThreeFour, getSinglePlayerBestTime_BoardFourFour, getSinglePlayerBestTime_BoardSixSix
    }
})