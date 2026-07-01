import { create } from "zustand"


const defaultSettings = {
    fontSize: 16,
    theme: "dark",
    minimap: false
}

const useSetings = create((set) => ({
    settings: defaultSettings,

    updateSettings: (updatedSetting) => {
        set((state) => ({
            settings: {
                ...state.settings,
                ...updatedSetting
            }
        }))
    },
    reset: () => {
        set(() => ({
            settings: defaultSettings
        }))
    }
}))