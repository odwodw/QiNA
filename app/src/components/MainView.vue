<style lang="scss">
#Uploader {
    text-align: center;
    height: 440px;
    width: 440px;
    display: block;
    position: absolute;
    top: 91px;
    left: 50%;
    margin-left: -220px;
    background-image: url("./MainView/assets/CirBg.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
}

.TextArea {
    position: absolute;
    top: 456px;
    width: 380px;
    text-align: center;
    font-size: 12px;
    color: #4990E2;
    .t {
        font-weight: 800;
        color: #3477D9;
    }
}

.ContentArea {
    margin: 20px;
    height: 400px;
    width: 400px;
}

.inBox {
    height: 204px;
    width: 204px;
    background: #FFFFFF;
    box-shadow: 0 24px 32px 0 rgba(0, 0, 0, 0.08);
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    transform: translate3d(0, 0, 0);
    .inBox-icon {
        width: 100px;
        height: 100px;
        position: absolute;
        left: 50%;
        margin-left: -50px;
        bottom: -8px;
        background-image: url("./MainView/assets/inBox.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
    }
}

.area {
    top: 0;
    position: absolute;
    left: 50%;
    width: 440px;
    margin-left: -220px;
    margin-top: -75px;
}

.areaText {
    color: #fff;
    z-index: 500;
    font-weight: 800;
}

.Uploading {
    box-shadow: 0 24px 32px 0 rgba(52, 119, 217, 0.24);
}

.wave {
    opacity: 0.6;
    position: absolute;
    top: 3%;
    left: 50%;
    background: #3477D9;
    width: 440px;
    height: 440px;
    margin-left: -220px;
    margin-top: -220px;
    transform-origin: 50% 48%;
    border-radius: 43%;
    animation: drift 3000ms infinite linear;
}

.wave.-three {
    animation: drift 2500ms infinite linear;
}

.wave.-two {
    animation: drift 5000ms infinite linear;
    opacity: 0.1;
    background: yellow;
}

@keyframes drift {
    from {
        transform: rotate(0deg);
    }
    from {
        transform: rotate(360deg);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}


.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-active {
    transform: translateY(-15px);
    opacity: 0;
}

.Draging {
    position: absolute;
    left: 50%;
    top: 210px;
    margin-left: -102px;
    z-index: 5000;
    height: 206px;
    width: 206px;
    background: rbga(0, 0, 0, 0);
    border-radius: 50%;
    animation: Rotate 10000ms infinite linear;
    border: 4px dashed #D2E7FD;
}

@-webkit-keyframes Rotate {
    from {
        -webkit-transform: rotate(0deg);
    }
    to {
        -webkit-transform: rotate(359deg);
    }
}
</style>
<template>
    <div>
        <transition name="fade">
            <div v-if="isDraging" class="Draging"></div>
        </transition>
        <div id="Uploader">
            <div class="ContentArea flex aitems-center jcontent-center">
                <div v-on:click="inBoxClick" class="inBox animated flex aitems-center jcontent-center" v-bind:class="{ 'pulse': isAnimete,'Uploading': isUploading }">
                    <transition name="slide-fade">
                        <div v-if="isUploading" class="areaText">
                            {{UploadingText}}
                        </div>
                    </transition>
                    <transition name="fade">
                        <div v-if="isUploading" class="area">
                            <div class='wave -one'></div>
                            <div class='wave -two'></div>
                            <div class='wave -three'></div>
                        </div>
                    </transition>
                    <transition name="fade">
                        <div v-if='!isUploading' class="wait">
                            <SvgGraphics></SvgGraphics>
                            <div class="inBox-icon"></div>
                            <!-- <img class="inBox-icon" src="./MainView/assets/inBox.png" alt=""> -->
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <div v-if="!HasPath" class="TextArea">
            <p class="t">{{title}}</p>
            <p>請選擇需要分享的檔案</p>
        </div>
        <div v-else class="TextArea">
            <p class="t">檔案</p>
            <span class="tag is-success">
      {{fileName}}
      <button v-if="!isUploading" v-on:click="cleanFile" class="delete is-small"></button>
    </span>
        </div>
        <div class="Control">
            <div v-if="isUploading">
                <p>
                    <button v-on:click="stop" class="button wide is-info">上傳中</button>
                </p>
                <p><span class="help">如果配置檔錯誤，也會導致一直顯示正在上傳</span></p>
            </div>
            <div v-if="!isUploading">
                <p>
                    <button v-on:click="openFile" v-bind:class="{ 'is-disabled': !SetReadly }" class="button wide is-info">{{buttonName}}</button>
                </p>
                <p>
                    <router-link to="/Setting" class="button wide is-info is-outlined">设定配置档</router-link>
                </p>
            </div>
            <!-- <p><button v-on:click="something" class="button is-info is-outlined">按鈕</button></p> -->
        </div>
    </div>
</template>
<script>
import SvgGraphics from './MainView/SvgGraphics'

import {
    ipcRenderer
}
from 'electron'
const {
    dialog
} = require('electron').remote

var options = {
    filters: [{
        name: 'All Files',
        extensions: ['*']
    }]
}

export default {
    data() {
        return {
            title: 'QiNA',
            copyData: 'copy data',
            Access: null,
            Secret: null,
            isAnimete: false,
            isUploading: false,
            Path: '',
            HasPath: false,
            buttonName: '選擇檔案',
            UploadingText: '正在上傳',
            fileName: '',
            SetReadly: false,
            isDraging: false
        }
    },
    components: {
        SvgGraphics
    },
    created: function() {
        // require('electron').remote.getCurrentWindow().setVibrancy('light')
        this.drop()
        this.getData()
    },
    methods: {
        something() {
            require('electron').remote.getCurrentWindow().setVibrancy('ultra-dark')
            console.log('something')
        },
        drop() {
            var that = this
            var timeoutID

            document.addEventListener('dragover', function(event) {
                event.stopPropagation()
                event.preventDefault()
                // console.log("dragover", event)
                that.isDraging = true
                window.clearTimeout(timeoutID)

                timeoutID = setTimeout(function() {
                    that.isDraging = false
                }, 800)
            })
            document.addEventListener('drop', function(event) {
                console.log('drop', event)
                event.stopPropagation()
                event.preventDefault()

                var files = event.dataTransfer.files
                console.log('files', files)

                that.openFile(files[0])
            })
        },
        stop() {
            // var that = this
            // that.UploadingText = '上傳中斷'
            // ipcRenderer.send('stopFile')
            // setTimeout(function() {
            //     that.HasPath = false
            //     that.isUploading = false
            // }, 600)
        },
        cleanFile() {
            var that = this
            that.HasPath = false
            that.fileName = ''
            that.buttonName = '選擇檔案'
        },
        openFile(file = '') {
            var that = this
            var way = ''

            console.log('openFile', file)

            // 如果有文件路徑，則呼叫主線程上傳文件
            if (file.isTrusted) {
                way = 'select'
            } else {
                way = 'onDrag'
            }

            if (that.HasPath) {
                way = 'upFiles'
            }

            if (file === 'inBoxClick') {
                way = 'select'
            }

            switch (way) {
                case 'select':
                    dialog.showOpenDialog(options, function(fileNames) {
                        if (fileNames === undefined) {
                            that.HasPath = false
                            that.fileName = ''
                            that.buttonName = '選擇檔案'
                            return false
                        } else {
                            var f = fileNames[0].split('/')
                            that.Path = fileNames[0]
                            that.HasPath = true
                            that.fileName = f[f.length - 1]
                            that.buttonName = '上傳'
                        }
                    })
                    break
                case 'onDrag':
                    that.Path = file.path
                    that.HasPath = true
                    that.fileName = file.name
                    that.buttonName = '上傳'
                    break
                case 'upFiles':
                    ipcRenderer.send('upFile', {
                        Path: that.Path,
                        Name: that.fileName
                    })

                    that.isUploading = true

                    ipcRenderer.on('progress', (event, arg) => {
                        that.UploadingText = arg
                    })

                    ipcRenderer.on('qina', (event, arg) => {
                        console.log(arg)

                        if (arg.state) {
                            console.log(arg.key)
                            that.UploadingText = '上傳完成'
                            setTimeout(function() {
                                that.HasPath = false
                                that.isUploading = false
                                that.$router.push('Done')
                            }, 1200)
                        }
                    })
                    break
                default:
            }
        },
        loadData() {
            var that = this
            ipcRenderer.on('LoadKeys', (event, arg) => {
                if (arg == null) {
                    that.SetReadly = false
                    that.buttonName = '尚未設定配置檔'
                } else {
                    if (arg.Access == null || arg.Bucket == null || arg.Domain == null || arg.Secret == null) {
                        that.SetReadly = false
                        that.buttonName = '配置檔設定不全'
                    } else {
                        that.SetReadly = true
                        that.buttonName = '選擇檔案'
                        that.Access = arg.Access
                        that.Secret = arg.Secret
                    }
                }
            })
        },
        getData() {
            ipcRenderer.send('getKeys')
            this.loadData()
        },
        inBoxClick() {
            var that = this

            this.loadData()
            if (!that.SetReadly) {
                return 0
            }

            this.isAnimete = true
            setTimeout(function() {
                that.openFile('inBoxClick')
                that.isAnimete = false
            }, 850)
        }
    },
    name: 'MainView'
}
</script>