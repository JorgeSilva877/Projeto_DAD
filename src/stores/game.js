import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useToast } from '@/components/ui/toast/use-toast'
export const useGameStore = defineStore('game', () => {
    const { toast } = useToast()
    const storeError = useErrorStore()
    const multiplayerMostWins = ref(null)
    const singleplayerBestTime_BoardThreeFour = ref(null)
    const singleplayerBestTime_BoardFourFour = ref(null)
    const singleplayerBestTime_BoardSixSix = ref(null)
    const singleplayerLessTurns_BoardThreeFour = ref(null)
    const singleplayerLessTurns_BoardFourFour = ref(null)
    const singleplayerLessTurns_BoardSixSix = ref(null)
    const personalGames = ref(null)

    

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

    const getSinglePlayerLessTurns_BoardThreeFour = computed(() => {
        return singleplayerLessTurns_BoardThreeFour.value ? singleplayerLessTurns_BoardThreeFour.value : []
    })

    const getSinglePlayerLessTurns_BoardFourFour = computed(() => {
        return singleplayerLessTurns_BoardFourFour.value ? singleplayerLessTurns_BoardFourFour.value : []
    })

    const getSinglePlayerLessTurns_BoardSixSix = computed(() => {
        return singleplayerLessTurns_BoardSixSix.value ? singleplayerLessTurns_BoardSixSix.value : []
    })

    const getPersonalGames = computed(() => {
        return personalGames.value ? personalGames.value : []
    })

    const getGameDetail = (id) => {
        return computed(() => personalGames.value.find(game => game.id === id));
    };


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
           //jogos singleplayer -> Menos peças viradas (board 3x4)
           const singleplayerLessTurns_BoardThreeFour_promise = axios.get('topSingleplayerLessTurnsThreeFourBoard')
           //jogos singleplayer -> Menos peças viradas (board 4x4)
           const singleplayerLessTurns_BoardFourFour_promise = axios.get('topSingleplayerLessTurnsFourFourBoard')
           //jogos singleplayer -> Menos peças viradas (board 6x6)
           const singleplayerLessTurns_BoardSixSix_promise = axios.get('topSingleplayerLessTurnsSixSixBoard')

           multiplayerMostWins.value = (await multiplayerMostWins_promise).data

           singleplayerBestTime_BoardThreeFour.value = (await singleplayerBestTime_BoardThreeFour_promise).data
           singleplayerBestTime_BoardFourFour.value = (await singleplayerBestTime_BoardFourFour_promise).data
           singleplayerBestTime_BoardSixSix.value = (await singleplayerBestTime_BoardSixSix_promise).data

           singleplayerLessTurns_BoardThreeFour.value = (await singleplayerLessTurns_BoardThreeFour_promise).data
           singleplayerLessTurns_BoardFourFour.value = (await singleplayerLessTurns_BoardFourFour_promise).data
           singleplayerLessTurns_BoardSixSix.value = (await singleplayerLessTurns_BoardSixSix_promise).data

           return true

        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors,
                e.response.status, 'Cannot load scoreboard!')
            return false
        }
    }


    const fetchPersonalGames = async (userId) => {
        storeError.resetMessages()
        try {
            if (userId == 0) {
                console.log(userId)
                toast({
                    description: 'Cannot load your history. Try again later.',
                    variant: 'destructive',
                });
                
                return false
            }

           //faz pedido get à API para ter todos os jogos do utilizador
           const allPersonalGames_promise =  axios.get('game/allGames_'+userId)
            //Atribui o resultado à variavel da store
           personalGames.value = (await allPersonalGames_promise).data


           return true

        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors,
                e.response.status, 'Cannot load your history. Try again later.')
            return false
        }
    }
   
    return {
        fetchScoreboard, fetchPersonalGames,
        getMultiplayerMostWins, getSinglePlayerBestTime_BoardThreeFour, getSinglePlayerBestTime_BoardFourFour, getSinglePlayerBestTime_BoardSixSix,
        getSinglePlayerLessTurns_BoardThreeFour, getSinglePlayerLessTurns_BoardFourFour, getSinglePlayerLessTurns_BoardSixSix, getPersonalGames,
        getGameDetail
    }
})