import { create } from "zustand"
import {persist} from "zustand/middleware"

const defaultSettings = {
    fontSize: 16,
    theme: "dark",
    minimap: false
}

const useSetings = create(persist((set,get) => ({
    settings: defaultSettings,
    getSettings : ()=>get().settings,
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
}),
{name:"editor-settings"}
))

export{useSetings}