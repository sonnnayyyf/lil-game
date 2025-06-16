// GlobalData.js
const GlobalData = {
    playerMovementData: {
        level1: [],
        level2: [],
        level3: [],
        level4: [],
        level5: [],
        level6: [],
        level7: [],
        level8: [],
        level9: [],
        level10: [],
        level11: [],
        level12: [],
        level13: []
    },

    savePlayerMovementData(level, data) {
        if (!this.playerMovementData[level]) {
            this.playerMovementData[level] = [];
        }
        this.playerMovementData[level] = data;
    }
};

export default GlobalData;
