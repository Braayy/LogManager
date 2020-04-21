Vue.component('tab', {
    methods: {
        changeTab() {
            this.$root.changeTab(this.$props.title)
        }
    },
    props: [ 'title' ],
    template: `
        <div
            :class="{ 'tab-title': true, 'selected-tab': (title === this.$root.selectedTab)}"
            @click="changeTab">
            <p>{{ title }}</p>
        </div>
    `
})

Vue.component('log', {
    props: [ 'level', 'time', 'content' ],
    template: `
        <div class="log">
            <div :class="[ 'level', 'level-' + this.$props.level.toLowerCase() ]"><p>{{ level }}</p></div>
            <div class="time"><p>{{ time }}</p></div>
            <div class="content"><p>{{ content }}</p></div>
        </div>
    `
})

Vue.component('controls', {
    methods: {
        refresh() {
            this.$root.requestLogs()
        },
        clear() {
            this.$root.clearLogs()
            this.$root.logs = this.$root.logs.filter(log => log.tab !== this.$root.selectedTab)
            this.$root.tabs = this.$root.tabs.filter(tab => tab !== this.$root.selectedTab)
            this.$root.selectedTab = this.$root.tabs[0] || ''
        }
    },
    template: `
        <div class="controls">
            <span
                class="material-icons"
                @click="clear">done</span>
            <span
                class="material-icons"
                @click="refresh">refresh</span>
        </div>
    `
})

Vue.component('error-viewer', {
    props: [ 'error' ],
    template: `
        <div class="error-viewer"><p>{{ error }}</p></div>
    `
})

const app = new Vue({
    el: '#app',
    data: {
        errorMessage: '',
        selectedTab: '',
        tabs: [],
        logs: []
    },
    methods: {
        changeTab(tab) {
            this.selectedTab = tab
            this.requestLogs()
        },
        requestLogs() {
            const containsLog = (log) => {
                return this.logs.filter(localLog => localLog._id === log._id).length > 0
            }

            this.errorMessage = ''

            fetch('http://localhost:8000/logs')
                .then(response => response.ok ? response.json() : response.text())
                .then(logs => {
                    if (typeof logs === 'string') {
                        this.errorMessage = logs
                        return
                    }

                    for (const log of logs) {
                        if (!this.tabs.includes(log.tab)) {
                            this.tabs.push(log.tab)
                        }

                        if (!containsLog(log)) {
                            this.logs.push({
                                _id: log._id,
                                tab: log.tab,
                                level: log.level,
                                time: log.time,
                                content: log.content,
                            })
                        }
                    }

                    if (!this.selectedTab) {
                        this.selectedTab = this.tabs[0] || ''
                    }
                })
        },
        clearLogs() {
            this.errorMessage = ''
            if (!this.selectedTab) return

            fetch(`http://localhost:8000/logs?tab=${this.selectedTab}`, {
                method: 'PUT'
            })
                .then(response => !response.ok ? response.text() : '')
                .then(errorMessage => {
                    if (errorMessage) {
                        this.errorMessage = errorMessage
                    }
                })
        }
    },
    mounted() {
        this.requestLogs()
    }
})