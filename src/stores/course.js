import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    option: {
      startDate: '',
      endDate: '',
      dayTrip: false,
      district: '',
      placeCount: 3,
      food: true,
      hotel: false,
      transport: true,
    },
  }),

  actions: {
    setOption(option) {
      this.option = {
        ...this.option,
        ...option,
      }
    },
  },
})
