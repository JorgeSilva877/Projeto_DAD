import { ref, computed, compile } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useToast } from '@/components/ui/toast/use-toast'
export const useGameStore = defineStore('games', () => {
    const { toast } = useToast()
    const storeError = useErrorStore()

    const currentGame  = ref([])

    const multiplayerMostWins = ref(null)
    const singleplayerBestTime_BoardThreeFour = ref(null)
    const singleplayerBestTime_BoardFourFour = ref(null)
    const singleplayerBestTime_BoardSixSix = ref(null)
    const singleplayerLessTurns_BoardThreeFour = ref(null)
    const singleplayerLessTurns_BoardFourFour = ref(null)
    const singleplayerLessTurns_BoardSixSix = ref(null)
    const personalGames = ref(null)
    const multiplayerGameUsers = ref(null)
    const personalScoreBoardByTime = ref(null)
    const personalScoreBoardByMoves = ref(null)
    const games = ref(null)
    const page = ref(1)
    const filters = ref({
        type: '',
        status: '',
        sort_by: 'created_at',
        sort_direction: 'desc'
    })

    const getCurrentGameId = computed(() => {
        return currentGame.value ? currentGame.value.id : null
    })

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

    const getMultiplayerGameUsers = computed(() => {
        return multiplayerGameUsers.value ? multiplayerGameUsers.value : []
    })

    const getPersonalScoreboardByTime = computed(() => {
        return personalScoreBoardByTime.value ? personalScoreBoardByTime.value : []
    })

    const getPersonalScoreBoardByMoves = computed(() => {
        return personalScoreBoardByMoves.value ? personalScoreBoardByMoves.value : []
    })

    const getAllGames = computed(() => {
        return games.value ? games.value : []
    })
    

    const getGameDetail = (id) => {
        return personalGames.value == null ? computed(() => games.value.find(game => game.id === id)) : computed(() => personalGames.value.find(game => game.id === id));
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
    /*
    const fetchGames = async () => {
        storeError.resetMessages()
        try {
            //faz pedido get à API para ter todos os jogos do utilizador
           const allGamesPromise =  axios.get('game/allGames')
            //Atribui o resultado à variavel da store
           games.value = (await allGamesPromise).data
           return true

        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors,
                e.response.status, 'Cannot load your history. Try again later.')
            return false
        }
    }*/

    const startGame = async (gameData) => {
        storeError.resetMessages()
        try {
            const response = await axios.post('games', gameData);
            console.log('Jogo iniciado com sucesso:', response.data.data);
            currentGame.value.push(response.data.data);
            console.log('currentGame:', currentGame.value);
            return response.data.data; // Retorna o jogo com o id gerado
        } catch (error) {
            console.error('Erro ao iniciar o jogo:', error);
            
        }
    };

    const endGame = async (gameId, gameResults) => {
        storeError.resetMessages()
        try {
            const response = await axios.put(`games/${gameId}`, gameResults);
            console.log('Jogo atualizado com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao atualizar o jogo:', error);
        }
    };

    const gameInterrupted = async (gameId, status) => {
        storeError.resetMessages()
        try {
            const response = await axios.put(`games/${gameId}`, status);
            console.log('Jogo interrompido', response.data);
        } catch (error) {
            console.error('Erro ao interromper jogo:', error);
        }
    };


    const fetchPersonalGames = async (userId) => {
        storeError.resetMessages()
        try {
            if (userId == 0) {
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

    const fetchMultiplayerGameUsersDetail = async (gameId) => {
        storeError.resetMessages()
        try {
            if (gameId == null) {
                return false
            }

           //faz pedido get à API 
           const allUsers_promise =  axios.get('game/usersDetailFrom_'+gameId)
            //Atribui o resultado à variavel da store
           multiplayerGameUsers.value = (await allUsers_promise).data


           return true

        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors,
                e.response.status, 'Cannot load your history. Try again later.')
            return false
        }
    }

    const fetchPersonalScoreboard = async (userId) => {
        storeError.resetMessages()
        try {
            if (userId == 0) {
                return false
            }

            //faz pedido get à API 
            const personalScoreboardByTime_promise =  axios.get('game/scoreboardByTime_'+userId)
            const personalScoreboardByMoves_promise =  axios.get('game/scoreboardByMoves_'+userId)
            //Atribui o resultado à variavel da store
            personalScoreBoardByTime.value = (await personalScoreboardByTime_promise).data
            personalScoreBoardByMoves.value = (await personalScoreboardByMoves_promise).data


           return true

        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors,
                e.response.status, 'Cannot load your scoreboard. Try again later.')
            return false
        }
    }

    const totalGames = computed(() => games.value?.length)

    const resetPage = () => {
        page.value = 1
        games.value = null
      }
    
      const fetchGames = async (resetPagination = false) => {
        if (resetPagination) {
          resetPage()
        }
    
        const queryParams = new URLSearchParams({
          page: page.value,
          ...(filters.value.type && { type: filters.value.type }),
          ...(filters.value.status && { status: filters.value.status }),
          sort_by: filters.value.sort_by,
          sort_direction: filters.value.sort_direction
        }).toString()
    
        const response = await axios.get(`/game/allGames?${queryParams}`)
    
        if (page.value === 1 || resetPagination) {
          games.value = response.data.data
        } else {
          games.value = [...(games.value || []), ...response.data.data]
        }
    
        return response.data
      }
    
      const fetchGamesNextPage = async () => {
        page.value++
        await fetchGames()
      }

    return {
        fetchScoreboard, fetchPersonalGames, fetchMultiplayerGameUsersDetail, fetchPersonalScoreboard, getCurrentGameId, fetchGames,
        getMultiplayerMostWins, getSinglePlayerBestTime_BoardThreeFour, getSinglePlayerBestTime_BoardFourFour, getSinglePlayerBestTime_BoardSixSix,
        getSinglePlayerLessTurns_BoardThreeFour, getSinglePlayerLessTurns_BoardFourFour, getSinglePlayerLessTurns_BoardSixSix, getPersonalGames,
        getGameDetail, getMultiplayerGameUsers, getPersonalScoreboardByTime, getPersonalScoreBoardByMoves,gameInterrupted, endGame, startGame, getAllGames,
        fetchGamesNextPage, games, totalGames, filters, page, fetchGames, resetPage

    }
})