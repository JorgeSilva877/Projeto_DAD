import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
export const useStatisticsStore = defineStore('statistic', () => {
    const storeError = useErrorStore()
    const totalUsers = ref(null)
    const totalGames = ref(null)
    const totalGamesThisMonth = ref(null)
    

    const getTotalUsers = computed(() => {
        return totalUsers.value ? totalUsers.value : []
    })

    const getTotalGames = computed(() => {
        return totalGames.value ? totalGames.value : []
    })

    const getTotalGamesThisMonth = computed(() => {
        return totalGamesThisMonth.value ? totalGamesThisMonth.value : []
    })


    const fetchAnonymousStatistics = async () => {
        storeError.resetMessages()
        try {
        
           //total users
           const totalUsers_promise =  axios.get('totalUsers')
           //total games played
           const totalGames_promise = axios.get('totalGamesPlayed')
           //jtotal games played this month
           const totalGamesThisMonth_promise = axios.get('totalGamesPlayedThisMonth')
           

           totalUsers.value = (await totalUsers_promise).data
           totalGames.value = (await totalGames_promise).data
           totalGamesThisMonth.value = (await totalGamesThisMonth_promise).data

           return true

        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors,
                e.response.status, 'Cannot load statistics. Try again later')
            return false
        }
    }
   
    return {
        getTotalUsers, getTotalGames, getTotalGamesThisMonth,
        fetchAnonymousStatistics
    }
})