import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
export const useStatisticsStore = defineStore('statistic', () => {
    const storeError = useErrorStore()
    const totalUsers = ref(null)
    const totalGames = ref(null)
    const totalGamesThisMonth = ref(null)
    const userStats = ref(null)
    const transactionsStats = ref(null)
    const gamesStats = ref(null)
    

    const getTotalUsers = computed(() => {
        return totalUsers.value ? totalUsers.value : []
    })

    const getTotalGames = computed(() => {
        return totalGames.value ? totalGames.value : []
    })

    const getTotalGamesThisMonth = computed(() => {
        return totalGamesThisMonth.value ? totalGamesThisMonth.value : []
    })

    const getUserStats = computed(() => {
        return userStats.value ? userStats.value : []
    })

    const getTransactionsStats = computed(() => {
        return transactionsStats.value ? transactionsStats.value : []
    })

    const getGamesStats = computed(() => {
        return gamesStats.value ? gamesStats.value : []
    })


    const fetchAnonymousStatistics = async () => {
        storeError.resetMessages()
        try {
        
           //total users
           const totalUsers_promise =  axios.get('totalUsers')
           //total games played
           const totalGames_promise = axios.get('totalGamesPlayed')
           //total games played this month
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

    const fetchAdminDashboard = async () => {

        storeError.resetMessages()
        try {
        
           //users statistcs
           const userStats_promise =  axios.get('admin/playersStatistics')
           //games statistics
           const gamesStats_promise = axios.get('admin/gamesStatistics')
           //transactions statistics
           const transactionsStats_promise = axios.get('admin/transactionsStatistics')
           

           userStats.value = (await userStats_promise).data
           gamesStats.value = (await gamesStats_promise).data
           transactionsStats.value = (await transactionsStats_promise).data

           return true

        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors,
                e.response.status, 'Cannot load the dashboard. Try again later')
            return false
        }

    }
   
    return {
        getTotalUsers, getTotalGames, getTotalGamesThisMonth, getUserStats, getTransactionsStats, getGamesStats,
        fetchAnonymousStatistics, fetchAdminDashboard
    }
})